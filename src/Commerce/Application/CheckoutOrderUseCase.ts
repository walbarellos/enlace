import { randomUUID } from 'crypto';
import { dbPool } from '../../Shared/Infrastructure/Database.js';
import { Result } from '../../Shared/Domain/Result.js';
import { SplitRule } from '../Domain/SplitRule.js';
import type { CreateOrderCheckoutDTO } from '../../Shared/Presentation/ValidationSchemas.js';

export interface CheckoutOrderOutput {
  orderId: string;
  itemType: string;
  totalCents: number;
  platformFeeCents: number;
  providerNetCents: number;
  pixCopiaECola: string;
  pixQrCodeUrl: string;
  status: string;
}

export class CheckoutOrderUseCase {
  public static async execute(
    clientAccountId: string,
    dto: CreateOrderCheckoutDTO
  ): Promise<Result<CheckoutOrderOutput>> {
    const client = await dbPool.connect();

    try {
      await client.query('BEGIN');

      let providerId: string;
      let contentAssetId: string | null = null;
      let totalCents: number;

      if (dto.item_type === 'MEDIA_SINGLE') {
        const assetRes = await client.query(
          `SELECT id, provider_id, price_cents, status, access_tier
           FROM public.content_assets
           WHERE id = $1`,
          [dto.target_id]
        );

        if (assetRes.rows.length === 0) {
          await client.query('ROLLBACK');
          return Result.fail('Mídia não encontrada');
        }

        const asset = assetRes.rows[0];
        if (asset.status !== 'ACTIVE') {
          await client.query('ROLLBACK');
          return Result.fail('Mídia indisponível para aquisição');
        }

        if (asset.access_tier === 'FREE_PUBLIC') {
          await client.query('ROLLBACK');
          return Result.fail('Esta mídia é pública e gratuita, não requer compra');
        }

        // Verifica se o cliente já possui o entitlement
        const entRes = await client.query(
          `SELECT id FROM public.entitlements 
           WHERE account_id = $1 AND content_asset_id = $2 AND is_revoked = FALSE`,
          [clientAccountId, asset.id]
        );

        if (entRes.rows.length > 0) {
          await client.query('ROLLBACK');
          return Result.fail('Você já possui acesso a este conteúdo');
        }

        providerId = asset.provider_id;
        contentAssetId = asset.id;
        totalCents = asset.price_cents;
      } else {
        // SUBSCRIPTION_TIER
        await client.query('ROLLBACK');
        return Result.fail('Aquisição de planos de assinatura deve ser feita via painel de prestador');
      }

      if (totalCents <= 0) {
        await client.query('ROLLBACK');
        return Result.fail('Valor da ordem inválido');
      }

      // 2. Aplicação estrita da regra matemática de Split 85/15
      const splitRes = SplitRule.calculate(totalCents);
      if (!splitRes.isSuccess) {
        await client.query('ROLLBACK');
        return Result.fail(splitRes.error || 'Erro no cálculo do split financeiro');
      }
      const split = splitRes.value;

      // 3. Geração de Payload Pix Estático/Dinâmico EMVCo simulado
      const idempotencyKey = `idemp_${randomUUID()}`;
      const pixCopiaECola =
        `00020101021226580014br.gov.bcb.pix0136${randomUUID()}520400005303986540` +
        `${(totalCents / 100).toFixed(2)}5802BR5915PLATAFORMA ENLACE6009RIO BRANCO62070503***6304`;
      const pixQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCopiaECola)}`;

      // 4. Grava ordem com constraint estrita de soma exata
      const orderRes = await client.query(
        `INSERT INTO public.orders (
           client_account_id,
           provider_profile_id,
           content_asset_id,
           item_type,
           total_cents,
           platform_fee_cents,
           provider_net_cents,
           payment_method,
           status,
           pix_copia_cola,
           pix_qr_code_url,
           gateway_idempotency_key
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'PIX', 'PENDING_PAYMENT', $8, $9, $10)
         RETURNING id, status`,
        [
          clientAccountId,
          providerId,
          contentAssetId,
          dto.item_type,
          split.totalCents,
          split.platformFeeCents,
          split.providerNetCents,
          pixCopiaECola,
          pixQrCodeUrl,
          idempotencyKey
        ]
      );

      const order = orderRes.rows[0];

      // 5. Grava evento no Transactional Outbox
      await client.query(
        `INSERT INTO public.outbox_events (aggregate_type, aggregate_id, event_type, payload)
         VALUES ('Order', $1, 'ORDER_CREATED', $2::jsonb)`,
        [
          order.id,
          JSON.stringify({
            orderId: order.id,
            clientAccountId,
            totalCents: split.totalCents,
            platformFeeCents: split.platformFeeCents,
            providerNetCents: split.providerNetCents
          })
        ]
      );

      await client.query('COMMIT');

      return Result.ok({
        orderId: order.id,
        itemType: dto.item_type,
        totalCents: split.totalCents,
        platformFeeCents: split.platformFeeCents,
        providerNetCents: split.providerNetCents,
        pixCopiaECola,
        pixQrCodeUrl,
        status: order.status
      });
    } catch (err: any) {
      await client.query('ROLLBACK');
      return Result.fail(`Falha ao gerar checkout Pix: ${err.message}`);
    } finally {
      client.release();
    }
  }
}
