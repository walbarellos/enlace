import { dbPool } from '../../Shared/Infrastructure/Database.js';
import { Result } from '../../Shared/Domain/Result.js';
import type { SubmitReviewDTO } from '../../Shared/Presentation/ValidationSchemas.js';

export interface SubmitReviewOutput {
  reviewId: string;
  isPublished: boolean;
  alertLogged: boolean;
  quarantineTriggered: boolean;
}

export class SubmitReviewUseCase {
  public static async execute(
    authorAccountId: string,
    dto: SubmitReviewDTO
  ): Promise<Result<SubmitReviewOutput>> {
    const client = await dbPool.connect();

    try {
      await client.query('BEGIN');

      // 1. Localiza a solicitação e mapeia autor e alvo
      const reqRes = await client.query(
        `SELECT sr.id, sr.status, 
                cp.account_id as client_account_id,
                pp.account_id as provider_account_id,
                pp.id as provider_profile_id
         FROM public.service_requests sr
         JOIN public.client_profiles cp ON cp.id = sr.client_profile_id
         JOIN public.provider_profiles pp ON pp.id = sr.provider_profile_id
         WHERE sr.id = $1`,
        [dto.service_request_id]
      );

      if (reqRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return Result.fail('Solicitação de serviço não encontrada');
      }

      const sReq = reqRes.rows[0];

      let authorType: 'CLIENT_TO_PROVIDER' | 'PROVIDER_TO_CLIENT';
      let targetAccountId: string;

      if (authorAccountId === sReq.client_account_id) {
        authorType = 'CLIENT_TO_PROVIDER';
        targetAccountId = sReq.provider_account_id;
      } else if (authorAccountId === sReq.provider_account_id) {
        authorType = 'PROVIDER_TO_CLIENT';
        targetAccountId = sReq.client_account_id;
      } else {
        await client.query('ROLLBACK');
        return Result.fail('Você não possui autorização para avaliar esta solicitação');
      }

      // 2. Verifica se a contraparte já enviou avaliação (Janela Cega)
      const oppositeAuthorType =
        authorType === 'CLIENT_TO_PROVIDER' ? 'PROVIDER_TO_CLIENT' : 'CLIENT_TO_PROVIDER';

      const existingPeerReview = await client.query(
        `SELECT id FROM public.reviews
         WHERE service_request_id = $1 AND author_type = $2`,
        [dto.service_request_id, oppositeAuthorType]
      );

      const willPublishBoth = existingPeerReview.rows.length > 0;

      // 3. Insere a avaliação
      const reviewRes = await client.query(
        `INSERT INTO public.reviews (
           service_request_id,
           author_account_id,
           target_account_id,
           author_type,
           rating_score,
           public_comment,
           is_published,
           published_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          dto.service_request_id,
          authorAccountId,
          targetAccountId,
          authorType,
          dto.rating_score,
          dto.public_comment || null,
          willPublishBoth,
          willPublishBoth ? new Date() : null
        ]
      );

      const reviewId = reviewRes.rows[0].id;

      // Se ambos avaliaram, publica a avaliação do par também
      if (willPublishBoth) {
        await client.query(
          `UPDATE public.reviews
           SET is_published = TRUE, published_at = NOW()
           WHERE id = $1`,
          [existingPeerReview.rows[0].id]
        );
      }

      // 4. Canal Confidencial de Segurança (Alerta Sigiloso)
      let alertLogged = false;
      let quarantineTriggered = false;

      if (dto.confidential_alert) {
        const narrativeBuffer = dto.confidential_alert.narrative
          ? Buffer.from(dto.confidential_alert.narrative, 'utf-8')
          : null;

        await client.query(
          `INSERT INTO public.confidential_safety_logs (
             reporter_account_id,
             target_account_id,
             incident_code,
             risk_weight,
             encrypted_narrative
           ) VALUES ($1, $2, $3, $4, $5)`,
          [
            authorAccountId,
            targetAccountId,
            dto.confidential_alert.incident_code,
            dto.confidential_alert.risk_weight,
            narrativeBuffer
          ]
        );

        alertLogged = true;

        // 5. Avaliação do limiar de quarentena preventiva comunitária
        const riskSummary = await client.query(
          `SELECT SUM(risk_weight) as total_risk, COUNT(*) as total_incidents
           FROM public.confidential_safety_logs
           WHERE target_account_id = $1
             AND created_at >= NOW() - INTERVAL '30 days'`,
          [targetAccountId]
        );

        const totalRisk = Number(riskSummary.rows[0].total_risk || 0);
        const totalIncidents = Number(riskSummary.rows[0].total_incidents || 0);

        // Limiar: Risco acumulado >= 15 ou mais de 2 incidentes graves
        if (totalRisk >= 15 || totalIncidents >= 3) {
          quarantineTriggered = true;

          // Se o alvo for um prestador, coloca o perfil em quarentena preventiva imediata
          if (authorType === 'CLIENT_TO_PROVIDER') {
            await client.query(
              `INSERT INTO public.quarantine_records (
                 target_profile_id, quarantine_reason, accumulated_strikes, status
               ) VALUES ($1, $2, $3, 'ACTIVE')`,
              [
                sReq.provider_profile_id,
                `Quarentena preventiva automática: limiar de risco atingido (${totalRisk} pontos / ${totalIncidents} alertas)`,
                totalIncidents
              ]
            );

            await client.query(
              `UPDATE public.provider_profiles
               SET status = 'SUSPENDED', updated_at = NOW()
               WHERE id = $1`,
              [sReq.provider_profile_id]
            );
          }

          // Grava evento no Outbox para auditoria urgente
          await client.query(
            `INSERT INTO public.outbox_events (aggregate_type, aggregate_id, event_type, payload)
             VALUES ('TrustSafety', $1, 'SAFETY_QUARANTINE_TRIGGERED', $2::jsonb)`,
            [
              targetAccountId,
              JSON.stringify({
                targetAccountId,
                totalRisk,
                totalIncidents,
                triggeredByServiceRequestId: dto.service_request_id
              })
            ]
          );
        }
      }

      await client.query('COMMIT');

      return Result.ok({
        reviewId,
        isPublished: willPublishBoth,
        alertLogged,
        quarantineTriggered
      });
    } catch (err: any) {
      await client.query('ROLLBACK');
      return Result.fail(`Falha ao registrar avaliação: ${err.message}`);
    } finally {
      client.release();
    }
  }
}
