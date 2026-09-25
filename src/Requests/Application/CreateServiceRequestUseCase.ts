import { dbPool } from '../../Shared/Infrastructure/Database.js';
import { Result } from '../../Shared/Domain/Result.js';
import type { CreateServiceRequestDTO } from '../../Shared/Presentation/ValidationSchemas.js';

export interface ServiceRequestOutput {
  requestId: string;
  clientPseudonym: string;
  providerArtisticName: string;
  channel: 'WHATSAPP' | 'TELEGRAM';
  deepLinkUrl: string;
  messageCard: string;
  status: string;
}

export class CreateServiceRequestUseCase {
  public static async execute(
    clientAccountId: string,
    dto: CreateServiceRequestDTO
  ): Promise<Result<ServiceRequestOutput>> {
    try {
      // 1. Obtém perfil do cliente
      const clientRes = await dbPool.query(
        'SELECT id, pseudonym FROM public.client_profiles WHERE account_id = $1',
        [clientAccountId]
      );

      if (clientRes.rows.length === 0) {
        return Result.fail('Apenas clientes com perfil ativo podem gerar solicitações');
      }

      const clientProfile = clientRes.rows[0];

      // 2. Obtém perfil do prestador e dados de contato (telefone da conta)
      const providerRes = await dbPool.query(
        `SELECT p.id, p.artistic_name, p.status, a.phone_number
         FROM public.provider_profiles p
         JOIN public.accounts a ON a.id = p.account_id
         WHERE p.id = $1`,
        [dto.provider_id]
      );

      if (providerRes.rows.length === 0) {
        return Result.fail('Prestador não encontrado');
      }

      const provider = providerRes.rows[0];

      if (provider.status !== 'ACTIVE') {
        return Result.fail('O perfil do prestador encontra-se temporariamente indisponível');
      }

      // 3. Registra a solicitação estruturada no banco
      const insertRes = await dbPool.query(
        `INSERT INTO public.service_requests (
           client_profile_id,
           provider_profile_id,
           requested_datetime,
           duration_hours,
           location_mode,
           requested_accommodations,
           external_channel_type,
           status
         ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, 'FORWARDED')
         RETURNING id, created_at`,
        [
          clientProfile.id,
          provider.id,
          dto.requested_datetime,
          dto.duration_hours,
          dto.location_mode,
          JSON.stringify(dto.accommodations),
          dto.channel
        ]
      );

      const requestRecord = insertRes.rows[0];

      // 4. Constrói o cartão estruturado de solicitação
      const accommodationsText =
        dto.accommodations.length > 0
          ? dto.accommodations.join(', ')
          : 'Nenhuma adaptação específica informada';

      const messageCard =
        `✨ *SOLICITAÇÃO DE ATENDIMENTO — PLATAFORMA ENLACE*\n` +
        `👤 *Cliente:* ${clientProfile.pseudonym} (Verificado +18)\n` +
        `📅 *Data e Hora:* ${new Date(dto.requested_datetime).toLocaleString('pt-BR')}\n` +
        `⏱️ *Duração:* ${dto.duration_hours} hora(s)\n` +
        `📍 *Modalidade:* ${dto.location_mode}\n` +
        `♿ *Necessidades de Acessibilidade:* ${accommodationsText}\n` +
        `🔒 *ID Seguro:* ${requestRecord.id}\n\n` +
        `_Mensagem gerada via enlace.app. Valores de atendimento presencial são combinados livremente entre as partes._`;

      // 5. Gera Deep Link externo
      const rawPhone = provider.phone_number || '5568999990000';
      const cleanPhone = rawPhone.replace(/\D/g, '');

      let deepLinkUrl = '';
      if (dto.channel === 'WHATSAPP') {
        deepLinkUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageCard)}`;
      } else {
        // TELEGRAM
        deepLinkUrl = `https://t.me/share/url?url=${encodeURIComponent('https://enlace.app')}&text=${encodeURIComponent(messageCard)}`;
      }

      return Result.ok({
        requestId: requestRecord.id,
        clientPseudonym: clientProfile.pseudonym,
        providerArtisticName: provider.artistic_name,
        channel: dto.channel,
        deepLinkUrl,
        messageCard,
        status: 'FORWARDED'
      });
    } catch (err: any) {
      return Result.fail(`Falha ao criar solicitação: ${err.message}`);
    }
  }
}
