import { dbPool } from '../Shared/Infrastructure/Database.js';
import { AuthTokenService } from '../Shared/Infrastructure/AuthTokenService.js';
import { FuzzyLocation } from '../Discovery/Domain/FuzzyLocation.js';

async function seed() {
  console.log('--- Iniciando Seeding de Dados Realistas da Plataforma Enlace ---');
  const client = await dbPool.connect();

  try {
    await client.query('BEGIN');

    const passwordHash = await AuthTokenService.hashPassword('SenhaForte123!');

    // Limpar tabelas de pedidos, avaliações e requisições para refresh limpo dos testes
    await client.query(`TRUNCATE TABLE public.payout_ledger, public.service_requests, public.reviews, public.entitlements, public.orders, public.content_assets, public.accessibility_offerings, public.provider_profiles CASCADE`);
    await client.query(`DELETE FROM public.accounts WHERE role = 'PROVIDER'`);

    // 1. Prestador 1: Juliana Medeiros (Rio Branco - AC, Bosque)
    const prov1Email = 'juliana.medeiros@enlace.app';
    const acc1Res = await client.query(
      `INSERT INTO public.accounts (email, phone_number, password_hash, role, verification_level)
       VALUES ($1, '5568999881122', $2, 'PROVIDER', 'LEVEL_3_VERIFIED_PROVIDER')
       RETURNING id`,
      [prov1Email, passwordHash]
    );
    const prov1AccountId = acc1Res.rows[0].id;
    const fuzzy1 = FuzzyLocation.generateFuzzyCoordinates({ latitude: -9.974, longitude: -67.824 }, 500);

    const p1Res = await client.query(
      `INSERT INTO public.provider_profiles (
         account_id, artistic_name, bio, state_uf, city, neighborhood, 
         fuzzy_geom, min_rate_cents, active_plan_tier, is_verified
       ) VALUES ($1, $2, $3, 'AC', 'Rio Branco', 'Bosque', ST_SetSRID(ST_MakePoint($4, $5), 4326), 25000, 'DIAMANTE', TRUE)
       RETURNING id`,
      [
        prov1AccountId,
        'Juliana VIP',
        'Atendimento carinhoso, empático e totalmente acessível para pessoas com deficiência física e surdos. Sem pressa, com foco na conexão autêntica e prazer mútuo.',
        fuzzy1.longitude,
        fuzzy1.latitude
      ]
    );
    const prov1ProfileId = p1Res.rows[0].id;

    await client.query(
      `INSERT INTO public.accessibility_offerings (provider_id, feature_code, details_text, is_verified)
       VALUES 
         ($1, 'COMM_LIBRAS', 'Certificado de Fluência em Libras CAS-AC', TRUE),
         ($1, 'MOB_RAMP_ELEVATOR', 'Espaço térreo com rampa NBR 9050 e elevador privativo', TRUE),
         ($1, 'MOB_ADAPTED_BATHROOM', 'Banheiro totalmente adaptado com barras de apoio', TRUE)`,
      [prov1ProfileId]
    );

    await client.query(
      `INSERT INTO public.content_assets (
         provider_id, media_type, access_tier, price_cents, title, description,
         original_s3_key, thumbnail_blur_s3_key, perceptual_hash, status, is_active
       ) VALUES (
         $1, 'PHOTO', 'PAYWALL_SINGLE', 3500, 'Ensaio Sensual Privado', 'Série exclusiva com 15 fotografias em alta resolução.',
         's3://enlace-media/raw/ens1.jpg', 'https://cdn.enlace.app/blur/ens1.jpg', 'phash_a1b2c3d4e5f60001', 'ACTIVE', TRUE
       )`,
      [prov1ProfileId]
    );

    // 2. Prestador 2: Lucas Moreno (Rio Branco - AC, Centro)
    const prov2Email = 'lucas.moreno@enlace.app';
    const acc2Res = await client.query(
      `INSERT INTO public.accounts (email, phone_number, password_hash, role, verification_level)
       VALUES ($1, '5568999773344', $2, 'PROVIDER', 'LEVEL_3_VERIFIED_PROVIDER')
       RETURNING id`,
      [prov2Email, passwordHash]
    );
    const prov2AccountId = acc2Res.rows[0].id;
    const fuzzy2 = FuzzyLocation.generateFuzzyCoordinates({ latitude: -9.968, longitude: -67.815 }, 600);

    const p2Res = await client.query(
      `INSERT INTO public.provider_profiles (
         account_id, artistic_name, bio, state_uf, city, neighborhood, 
         fuzzy_geom, min_rate_cents, active_plan_tier, is_verified
       ) VALUES ($1, $2, $3, 'AC', 'Rio Branco', 'Centro', ST_SetSRID(ST_MakePoint($4, $5), 4326), 20000, 'OURO', TRUE)
       RETURNING id`,
      [
        prov2AccountId,
        'Lucas Moreno',
        'Atendimento acolhedor, preparado para pessoas neurodivergentes, TEA e TDAH. Ritmo respeitado com consentimento explícito e iluminação intimista.',
        fuzzy2.longitude,
        fuzzy2.latitude
      ]
    );
    const prov2ProfileId = p2Res.rows[0].id;

    await client.query(
      `INSERT INTO public.accessibility_offerings (provider_id, feature_code, details_text, is_verified)
       VALUES 
         ($1, 'NEURO_LIGHT_CONTROL', 'Controle gradual de intensidade luminosa para evitar sobrecarga sensorial', TRUE),
         ($1, 'NEURO_SILENT_SPACE', 'Ambiente com isolamento acústico e sem ruídos bruscos', TRUE)`,
      [prov2ProfileId]
    );

    // 3. Prestador 3: Valentina Rossi (Rio Branco - AC, Jardim Europa)
    const prov3Email = 'valentina.rossi@enlace.app';
    const acc3Res = await client.query(
      `INSERT INTO public.accounts (email, phone_number, password_hash, role, verification_level)
       VALUES ($1, '5568999665544', $2, 'PROVIDER', 'LEVEL_3_VERIFIED_PROVIDER')
       RETURNING id`,
      [prov3Email, passwordHash]
    );
    const prov3AccountId = acc3Res.rows[0].id;
    const fuzzy3 = FuzzyLocation.generateFuzzyCoordinates({ latitude: -9.979, longitude: -67.830 }, 400);

    const p3Res = await client.query(
      `INSERT INTO public.provider_profiles (
         account_id, artistic_name, bio, state_uf, city, neighborhood, 
         fuzzy_geom, min_rate_cents, active_plan_tier, is_verified
       ) VALUES ($1, $2, $3, 'AC', 'Rio Branco', 'Jardim Europa', ST_SetSRID(ST_MakePoint($4, $5), 4326), 30000, 'DIAMANTE', TRUE)
       RETURNING id`,
      [
        prov3AccountId,
        'Valentina Rossi',
        'Especialista em massagem tântrica, relaxamento sensorial e momentos a dois. Suíte térrea privativa climatizada com banheira e total discrição.',
        fuzzy3.longitude,
        fuzzy3.latitude
      ]
    );
    const prov3ProfileId = p3Res.rows[0].id;

    await client.query(
      `INSERT INTO public.accessibility_offerings (provider_id, feature_code, details_text, is_verified)
       VALUES 
         ($1, 'MOB_WIDE_DOORS', 'Portas amplas com 90cm sem desnível', TRUE),
         ($1, 'NEURO_LIGHT_CONTROL', 'Iluminação dimerizável e aromaterapia suave', TRUE)`,
      [prov3ProfileId]
    );

    // 4. Prestador 4: Camila Ferraz (Rio Branco - AC, Aviário)
    const prov4Email = 'camila.ferraz@enlace.app';
    const acc4Res = await client.query(
      `INSERT INTO public.accounts (email, phone_number, password_hash, role, verification_level)
       VALUES ($1, '5568999554433', $2, 'PROVIDER', 'LEVEL_3_VERIFIED_PROVIDER')
       RETURNING id`,
      [prov4Email, passwordHash]
    );
    const prov4AccountId = acc4Res.rows[0].id;
    const fuzzy4 = FuzzyLocation.generateFuzzyCoordinates({ latitude: -9.965, longitude: -67.820 }, 550);

    const p4Res = await client.query(
      `INSERT INTO public.provider_profiles (
         account_id, artistic_name, bio, state_uf, city, neighborhood, 
         fuzzy_geom, min_rate_cents, active_plan_tier, is_verified
       ) VALUES ($1, $2, $3, 'AC', 'Rio Branco', 'Aviário', ST_SetSRID(ST_MakePoint($4, $5), 4326), 22000, 'OURO', TRUE)
       RETURNING id`,
      [
        prov4AccountId,
        'Camila Ferraz',
        'Carinhosa, estilo namoradinha (GFE). Acolhimento especial para pessoas com mobilidade reduzida e cães-guia. Conversa boa, paciência e sem tabus.',
        fuzzy4.longitude,
        fuzzy4.latitude
      ]
    );
    const prov4ProfileId = p4Res.rows[0].id;

    await client.query(
      `INSERT INTO public.accessibility_offerings (provider_id, feature_code, details_text, is_verified)
       VALUES 
         ($1, 'SUPP_GUIDE_DOG', 'Espaço preparado para receber cão-guia com bebedouro e área externa', TRUE),
         ($1, 'MOB_RAMP_ELEVATOR', 'Acesso 100% plano sem escadas', TRUE)`,
      [prov4ProfileId]
    );

    // 5. Prestador 5: Rafaella Santos (Rio Branco - AC, Cerâmica)
    const prov5Email = 'rafaella.santos@enlace.app';
    const acc5Res = await client.query(
      `INSERT INTO public.accounts (email, phone_number, password_hash, role, verification_level)
       VALUES ($1, '5568999443322', $2, 'PROVIDER', 'LEVEL_3_VERIFIED_PROVIDER')
       RETURNING id`,
      [prov5Email, passwordHash]
    );
    const prov5AccountId = acc5Res.rows[0].id;
    const fuzzy5 = FuzzyLocation.generateFuzzyCoordinates({ latitude: -9.971, longitude: -67.828 }, 450);

    const p5Res = await client.query(
      `INSERT INTO public.provider_profiles (
         account_id, artistic_name, bio, state_uf, city, neighborhood, 
         fuzzy_geom, min_rate_cents, active_plan_tier, is_verified
       ) VALUES ($1, $2, $3, 'AC', 'Rio Branco', 'Cerâmica', ST_SetSRID(ST_MakePoint($4, $5), 4326), 28000, 'DIAMANTE', TRUE)
       RETURNING id`,
      [
        prov5AccountId,
        'Rafaella Santos',
        'Mulher trans elegante, atenciosa e discreta. Atendimento VIP com local próprio higienizado, suíte privativa com ar-condicionado e total respeito.',
        fuzzy5.longitude,
        fuzzy5.latitude
      ]
    );
    const prov5ProfileId = p5Res.rows[0].id;

    await client.query(
      `INSERT INTO public.accessibility_offerings (provider_id, feature_code, details_text, is_verified)
       VALUES 
         ($1, 'MOB_WIDE_DOORS', 'Portas largas e passagem ampla', TRUE),
         ($1, 'COMM_LIBRAS', 'Atendimento com noções intermediárias de Libras', TRUE)`,
      [prov5ProfileId]
    );

    // 6. Cliente de Demonstração
    const clientEmail = 'cliente.demo@enlace.app';
    let cAccount = (await client.query('SELECT id FROM public.accounts WHERE email = $1', [clientEmail])).rows[0];

    if (!cAccount) {
      const accRes = await client.query(
        `INSERT INTO public.accounts (email, phone_number, password_hash, role, verification_level)
         VALUES ($1, '5568988887766', $2, 'CLIENT', 'LEVEL_2_VERIFIED_CLIENT')
         RETURNING id`,
        [clientEmail, passwordHash]
      );
      cAccount = accRes.rows[0];

      await client.query(
        `INSERT INTO public.client_profiles (account_id, pseudonym)
         VALUES ($1, 'Cliente_9942')`,
        [cAccount.id]
      );
    }

    await client.query('COMMIT');
    console.log('✓ Seeding finalizado com sucesso! 5 perfis autênticos e inclusivos cadastrados.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro durante seeding:', err);
    throw err;
  } finally {
    client.release();
    await dbPool.end();
  }
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
