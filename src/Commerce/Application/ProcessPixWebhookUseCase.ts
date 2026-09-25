import { randomUUID } from 'crypto';
import { dbPool } from '../../Shared/Infrastructure/Database.js';
import { Result } from '../../Shared/Domain/Result.js';
import type { PixWebhookDTO } from '../../Shared/Presentation/ValidationSchemas.js';

export interface PixWebhookOutput {
  orderId: string;
  status: string;
  entitlementGranted: boolean;
  ledgerId: string;
}

export class ProcessPixWebhookUseCase {
  public static async execute(dto: PixWebhookDTO): Promise<Result<PixWebhookOutput>> {
    const client = await dbPool.connect();

    try {
      await client.query('BEGIN');

      const orderRes = await client.query(
        `SELECT id, client_account_id, provider_profile_id, content_asset_id, item_type, 
                total_cents, platform_fee_cents, provider_net_cents, status
         FROM public.orders
         WHERE id = $1 FOR UPDATE`,
        [dto.order_id]
      );

      if (orderRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return Result.fail('Ordem não encontrada');
      }

      const order = orderRes.rows[0];

      if (order.status === 'PAID') {
        // Idempotência: Se já foi pago, confirma sem duplicar efeitos
        await client.query('ROLLBACK');
        return Result.ok({
          orderId: order.id,
          status: 'PAID',
          entitlementGranted: true,
          ledgerId: 'already_settled'
        });
      }

      if (order.status !== 'PENDING_PAYMENT') {
        await client.query('ROLLBACK');
        return Result.fail(`Ordem em estado incompatível para liquidação (${order.status})`);
      }

      if (dto.status !== 'PAID') {
        await client.query(
          `UPDATE public.orders SET status = 'EXPIRED', updated_at = NOW() WHERE id = $1`,
          [order.id]
        );
        await client.query('COMMIT');
        return Result.ok({
          orderId: order.id,
          status: 'EXPIRED',
          entitlementGranted: false,
          ledgerId: 'none'
        });
      }

      // Validação de integridade de quantia
      if (dto.paid_amount_cents !== order.total_cents) {
        await client.query('ROLLBACK');
        return Result.fail(
          `Divergência de valores Pix: recebido ${dto.paid_amount_cents}, esperado ${order.total_cents}`
        );
      }

      // 1. Atualiza Ordem para PAID
      await client.query(
        `UPDATE public.orders 
         SET status = 'PAID', 
             paid_at = NOW(), 
             gateway_transaction_id = $1,
             updated_at = NOW()
         WHERE id = $2`,
        [dto.gateway_transaction_id, order.id]
      );

      // 2. Desbloqueia Entitlement digital (se compra de mídia avulsa)
      let entitlementGranted = false;
      if (order.item_type === 'MEDIA_SINGLE' && order.content_asset_id) {
        await client.query(
          `INSERT INTO public.entitlements (
             account_id, content_asset_id, entitlement_type, order_id
           ) VALUES ($1, $2, 'PERPETUAL_SINGLE', $3)
           ON CONFLICT (account_id, content_asset_id) DO NOTHING`,
          [order.client_account_id, order.content_asset_id, order.id]
        );
        entitlementGranted = true;
      }

      // 3. Registra no Livro-Razão (Payout Ledger) para repasse dos 85% líquidos
      const transferId = `pix_split_${randomUUID()}`;
      const ledgerRes = await client.query(
        `INSERT INTO public.payout_ledger (
           order_id, provider_profile_id, amount_cents, pix_key_masked, gateway_transfer_id, status
         ) VALUES ($1, $2, $3, '***.***.999-**', $4, 'SETTLED')
         RETURNING id`,
        [order.id, order.provider_profile_id, order.provider_net_cents, transferId]
      );

      const ledgerId = ledgerRes.rows[0].id;

      // 4. Grava evento no Outbox
      await client.query(
        `INSERT INTO public.outbox_events (aggregate_type, aggregate_id, event_type, payload)
         VALUES ('Order', $1, 'ORDER_PAID', $2::jsonb)`,
        [
          order.id,
          JSON.stringify({
            orderId: order.id,
            clientAccountId: order.client_account_id,
            providerProfileId: order.provider_profile_id,
            totalCents: order.total_cents,
            providerNetCents: order.provider_net_cents
          })
        ]
      );

      await client.query('COMMIT');

      return Result.ok({
        orderId: order.id,
        status: 'PAID',
        entitlementGranted,
        ledgerId
      });
    } catch (err: any) {
      await client.query('ROLLBACK');
      return Result.fail(`Falha ao liquidar Pix: ${err.message}`);
    } finally {
      client.release();
    }
  }
}
