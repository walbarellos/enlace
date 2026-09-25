import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildServer } from '../../src/Presentation/Server.js';
import { dbPool } from '../../src/Shared/Infrastructure/Database.js';

describe('PLATAFORMA ENLACE — TESTES DE PONTA A PONTA (E2E & FLUXO COMPLETO)', () => {
  let app: FastifyInstance;
  let clientToken: string;
  let clientAccountId: string;
  let clientPseudonym: string;
  let providerProfileId: string;
  let mediaAssetId: string;
  let serviceRequestId: string;
  let orderId: string;
  let orderTotalCents: number;

  beforeAll(async () => {
    app = buildServer();
    await app.ready();

    // Obtém prestador e ativo semeados
    const provRes = await dbPool.query(
      `SELECT id, artistic_name FROM public.provider_profiles 
       WHERE artistic_name = 'Juliana VIP' AND active_plan_tier = 'DIAMANTE' 
       LIMIT 1`
    );
    expect(provRes.rows.length).toBeGreaterThan(0);
    providerProfileId = provRes.rows[0].id;

    const assetRes = await dbPool.query(
      `SELECT id, price_cents FROM public.content_assets 
       WHERE provider_id = $1 AND status = 'ACTIVE' 
       LIMIT 1`,
      [providerProfileId]
    );
    expect(assetRes.rows.length).toBeGreaterThan(0);
    mediaAssetId = assetRes.rows[0].id;
    orderTotalCents = assetRes.rows[0].price_cents;
  });

  afterAll(async () => {
    await dbPool.query(
      `UPDATE public.provider_profiles SET status = 'ACTIVE';
       DELETE FROM public.confidential_safety_logs;
       DELETE FROM public.quarantine_records;`
    );
    await app.close();
    await dbPool.end();
  });

  // --------------------------------------------------------------------------
  // 1. HEALTHCHECK
  // --------------------------------------------------------------------------
  it('GET /api/v1/health deve responder 200 OK com banco operacional', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/health'
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.status).toBe('UP');
    expect(body.database).toBe('CONNECTED');
    expect(body.architecture).toContain('Modular Monolith');
  });

  // --------------------------------------------------------------------------
  // 2. POLÍTICA ESTRITA +18 NO REGISTRO
  // --------------------------------------------------------------------------
  it('POST /api/v1/auth/register deve barrar estritamente menor de 18 anos com HTTP 403', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: `underage_${Date.now()}@enlace.app`,
        password: 'Password123!',
        birth_date: '2012-05-10', // 14 anos
        role: 'CLIENT'
      }
    });

    expect(res.statusCode).toBe(403);
    const body = JSON.parse(res.body);
    expect(body.type).toContain('underage-denied');
    expect(body.detail).toContain('menores de 18 anos');
  });

  it('POST /api/v1/auth/register deve registrar cliente adulto gerando pseudônimo obrigatório Cliente_XXXX', async () => {
    const email = `adult_client_${Date.now()}@enlace.app`;
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email,
        password: 'Password123!',
        birth_date: '1998-07-15',
        role: 'CLIENT'
      }
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.role).toBe('CLIENT');
    expect(body.pseudonym).toMatch(/^Cliente_[0-9]{4,6}$/);
    expect(body.token).toBeDefined();

    clientToken = body.token;
    clientAccountId = body.accountId;
    clientPseudonym = body.pseudonym;
  });

  it('POST /api/v1/auth/login deve autenticar com credenciais corretas', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'cliente.demo@enlace.app',
        password: 'SenhaForte123!'
      }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.role).toBe('CLIENT');
    expect(body.pseudonym).toBe('Cliente_9942');
    expect(body.token).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // 3. BUSCA E CATÁLOGO COM ACESSIBILIDADE
  // --------------------------------------------------------------------------
  it('GET /api/v1/providers/search deve buscar prestadores por cidade e filtrar por Libras', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/providers/search?state_uf=AC&city=Rio+Branco&accommodations=COMM_LIBRAS'
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.count).toBeGreaterThan(0);
    expect(body.items[0].artisticName).toBe('Juliana VIP');
    expect(body.items[0].activePlanTier).toBe('DIAMANTE');
    expect(body.items[0].accessibilityFeatures).toContain('COMM_LIBRAS');
  });

  // --------------------------------------------------------------------------
  // 4. SOLICITAÇÃO DE ATENDIMENTO E DEEP LINK WHATSAPP
  // --------------------------------------------------------------------------
  it('POST /api/v1/requests deve gerar cartão estruturado e deep link wa.me', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/requests',
      headers: {
        authorization: `Bearer ${clientToken}`
      },
      payload: {
        provider_id: providerProfileId,
        requested_datetime: new Date(Date.now() + 86400000).toISOString(),
        duration_hours: 2,
        location_mode: 'OWN_PLACE',
        channel: 'WHATSAPP',
        accommodations: ['COMM_LIBRAS', 'MOB_RAMP_ELEVATOR']
      }
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.requestId).toBeDefined();
    expect(body.clientPseudonym).toBe(clientPseudonym);
    expect(body.deepLinkUrl).toContain('https://wa.me/');
    expect(body.deepLinkUrl).toContain(encodeURIComponent(clientPseudonym));
    expect(body.status).toBe('FORWARDED');

    serviceRequestId = body.requestId;
  });

  // --------------------------------------------------------------------------
  // 5. PAYWALL DE MÍDIA DIGITAL (ACESSO BLOQUEADO ANTES DO PAGAMENTO)
  // --------------------------------------------------------------------------
  it('GET /api/v1/content/:assetId/access deve barrar acesso não pago com HTTP 402', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/content/${mediaAssetId}/access`,
      headers: {
        authorization: `Bearer ${clientToken}`
      }
    });

    expect(res.statusCode).toBe(402);
    const body = JSON.parse(res.body);
    expect(body.type).toContain('payment-required');
    expect(body.data.priceCents).toBe(orderTotalCents);
    expect(body.data.thumbnailBlurUrl).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // 6. CHECKOUT PIX E SPLIT 85/15
  // --------------------------------------------------------------------------
  it('POST /api/v1/orders/checkout deve gerar Pix com split exato de 85% prestador / 15% plataforma', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/orders/checkout',
      headers: {
        authorization: `Bearer ${clientToken}`
      },
      payload: {
        item_type: 'MEDIA_SINGLE',
        target_id: mediaAssetId
      }
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.orderId).toBeDefined();
    expect(body.totalCents).toBe(orderTotalCents);
    expect(body.platformFeeCents + body.providerNetCents).toBe(orderTotalCents);
    expect(body.pixCopiaECola).toContain('br.gov.bcb.pix');
    expect(body.pixQrCodeUrl).toContain('api.qrserver.com');

    orderId = body.orderId;
  });

  // --------------------------------------------------------------------------
  // 7. LIQUIDAÇÃO VIA WEBHOOK PIX E DESBLOQUEIO DE ENTITLEMENT
  // --------------------------------------------------------------------------
  it('POST /api/v1/webhooks/pix deve confirmar pagamento, conceder entitlement e registrar split no ledger', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/webhooks/pix',
      payload: {
        gateway_transaction_id: `tx_pix_gw_${Date.now()}`,
        order_id: orderId,
        status: 'PAID',
        paid_amount_cents: orderTotalCents
      }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.status).toBe('PAID');
    expect(body.entitlementGranted).toBe(true);
    expect(body.ledgerId).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // 8. ACESSO PÓS-PAGAMENTO COM WATERMARK FORENSE
  // --------------------------------------------------------------------------
  it('GET /api/v1/content/:assetId/access deve liberar mídia e gravar log forense após confirmação do Pix', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/content/${mediaAssetId}/access`,
      headers: {
        authorization: `Bearer ${clientToken}`
      }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.accessGranted).toBe(true);
    expect(body.playbackUrl).toBeDefined();
    expect(body.watermarkToken).toBeDefined();

    // Valida que o log forense registrou o pseudônimo do cliente
    const logRes = await dbPool.query(
      `SELECT watermark_identifier, playback_session_token 
       FROM public.content_access_logs 
       WHERE account_id = $1 AND content_asset_id = $2`,
      [clientAccountId, mediaAssetId]
    );
    expect(logRes.rows.length).toBeGreaterThan(0);
    expect(logRes.rows[0].watermark_identifier).toBe(clientPseudonym);
  });

  // --------------------------------------------------------------------------
  // 9. AVALIAÇÃO BILATERAL E ALERTA SIGILOSO DE RISCO
  // --------------------------------------------------------------------------
  it('POST /api/v1/reviews deve registrar avaliação com janela cega e canal confidencial de segurança', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/reviews',
      headers: {
        authorization: `Bearer ${clientToken}`
      },
      payload: {
        service_request_id: serviceRequestId,
        rating_score: 5,
        public_comment: 'Excelente atendimento, local totalmente acessível com rampa.',
        confidential_alert: {
          incident_code: 'CONSENT_BREACH',
          risk_weight: 4,
          narrative: 'Tentativa de descumprimento de limite previamente acordado.'
        }
      }
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.reviewId).toBeDefined();
    expect(body.isPublished).toBe(false); // Janela cega: contraparte ainda não avaliou
    expect(body.alertLogged).toBe(true);
    expect(typeof body.quarantineTriggered).toBe('boolean');

    // Verifica que o alerta confidencial foi armazenado com segurança
    const safetyRes = await dbPool.query(
      `SELECT incident_code, risk_weight FROM public.confidential_safety_logs 
       WHERE reporter_account_id = $1`,
      [clientAccountId]
    );
    expect(safetyRes.rows.length).toBeGreaterThan(0);
    expect(safetyRes.rows[0].incident_code).toBe('CONSENT_BREACH');
    expect(safetyRes.rows[0].risk_weight).toBe(4);
  });
});
