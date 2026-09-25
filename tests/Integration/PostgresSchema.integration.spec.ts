// ============================================================================
// PLATAFORMA ENLACE — TESTES DE INTEGRAÇÃO COM BANCO REAL (POSTGRESQL 16)
// Arquivo: tests/Integration/PostgresSchema.integration.spec.ts
// ============================================================================

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { dbPool } from '../../src/Shared/Infrastructure/Database.js';

describe('Integração com PostgreSQL 16 + PostGIS (Validação de Constraints e RLS)', () => {
  beforeAll(async () => {
    // Garante que o banco está acessível
    const res = await dbPool.query('SELECT 1 as is_alive');
    expect(res.rows[0].is_alive).toBe(1);
  });

  afterAll(async () => {
    await dbPool.end();
  });

  it('deve validar constraint regex no banco e aceitar pseudônimo válido Cliente_XXXX', async () => {
    const email = `test_client_${Date.now()}_${Math.random()}@enlace.app`;
    const randomDigits = Math.floor(1000 + Math.random() * 8999);
    const validPseudonym = `Cliente_${randomDigits}`;
    
    // Cria conta
    const accountRes = await dbPool.query(
      `INSERT INTO public.accounts (email, password_hash, role)
       VALUES ($1, 'hashed_pw', 'CLIENT')
       RETURNING id`,
      [email]
    );
    const accountId = accountRes.rows[0].id;

    // Cria perfil sob pseudônimo válido
    const profileRes = await dbPool.query(
      `INSERT INTO public.client_profiles (account_id, pseudonym)
       VALUES ($1, $2)
       RETURNING id, pseudonym`,
      [accountId, validPseudonym]
    );

    expect(profileRes.rows[0].pseudonym).toBe(validPseudonym);
  });

  it('deve barrar no nível do banco (CHECK CONSTRAINT) qualquer tentativa de gravar nome civil como pseudônimo', async () => {
    const email = `test_fail_${Date.now()}_${Math.random()}@enlace.app`;
    
    const accountRes = await dbPool.query(
      `INSERT INTO public.accounts (email, password_hash, role)
       VALUES ($1, 'hashed_pw', 'CLIENT')
       RETURNING id`,
      [email]
    );
    const accountId = accountRes.rows[0].id;

    // Tenta inserir nome civil violando chk_pseudonym_format
    await expect(
      dbPool.query(
        `INSERT INTO public.client_profiles (account_id, pseudonym)
         VALUES ($1, $2)`,
        [accountId, 'Marcos da Silva']
      )
    ).rejects.toThrowError(/chk_pseudonym_format/);
  });

  it('deve aplicar com rigor a invariante matemática de split no banco (chk_order_split_exact_sum)', async () => {
    const emailClient = `client_ord_${Date.now()}_${Math.random()}@enlace.app`;
    const emailProvider = `prov_ord_${Date.now()}_${Math.random()}@enlace.app`;

    const cAcc = await dbPool.query(
      `INSERT INTO public.accounts (email, password_hash, role) VALUES ($1, 'pw', 'CLIENT') RETURNING id`,
      [emailClient]
    );
    const pAcc = await dbPool.query(
      `INSERT INTO public.accounts (email, password_hash, role, verification_level) VALUES ($1, 'pw', 'PROVIDER', 'LEVEL_3_VERIFIED_PROVIDER') RETURNING id`,
      [emailProvider]
    );

    // Cria provider profile
    const pProf = await dbPool.query(
      `INSERT INTO public.provider_profiles (account_id, artistic_name, state_uf, city, neighborhood, fuzzy_geom)
       VALUES ($1, 'Juliana VIP', 'AC', 'Rio Branco', 'Bosque', public.generate_fuzzy_point(-9.974, -67.824))
       RETURNING id`,
      [pAcc.rows[0].id]
    );

    const clientId = cAcc.rows[0].id;
    const providerId = pProf.rows[0].id;

    // 1. Ordem com soma exata (10000 = 1500 + 8500) -> DEVE PASSAR
    const validOrder = await dbPool.query(
      `INSERT INTO public.orders 
       (client_account_id, provider_profile_id, item_type, total_cents, platform_fee_cents, provider_net_cents, payment_method, gateway_idempotency_key)
       VALUES ($1, $2, 'MEDIA_SINGLE', 10000, 1500, 8500, 'PIX', $3)
       RETURNING id, total_cents`,
      [clientId, providerId, `idemp_valid_${Date.now()}_${Math.random()}`]
    );
    expect(validOrder.rows[0].total_cents).toBe(10000);

    // 2. Ordem com divergência (10000 != 1000 + 8000) -> DEVE SER RECUSADA PELO BANCO
    await expect(
      dbPool.query(
        `INSERT INTO public.orders 
         (client_account_id, provider_profile_id, item_type, total_cents, platform_fee_cents, provider_net_cents, payment_method, gateway_idempotency_key)
         VALUES ($1, $2, 'MEDIA_SINGLE', 10000, 1000, 8000, 'PIX', $3)`,
        [clientId, providerId, `idemp_fraud_${Date.now()}_${Math.random()}`]
      )
    ).rejects.toThrowError(/chk_order_split_exact_sum/);
  });

  it('deve executar busca PostGIS e cálculo de compatibilidade com a função search_providers_catalog', async () => {
    const centerGeomRes = await dbPool.query(`SELECT ST_SetSRID(ST_MakePoint(-67.824, -9.974), 4326) as geom`);
    const centerGeom = centerGeomRes.rows[0].geom;

    const results = await dbPool.query(
      `SELECT * FROM public.search_providers_catalog(
         'AC',
         'Rio Branco',
         $1,
         50000.0,
         ARRAY['COMM_LIBRAS', 'MOB_RAMP_ELEVATOR']::VARCHAR[]
       )`,
      [centerGeom]
    );

    // A função deve retornar resultados válidos sem erro de SQL
    expect(Array.isArray(results.rows)).toBe(true);
    expect(results.rows.length).toBeGreaterThanOrEqual(1);
    expect(results.rows[0].artistic_name).toBe('Juliana VIP');
  });
});
