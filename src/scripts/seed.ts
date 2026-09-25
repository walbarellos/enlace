import { dbPool } from '../Shared/Infrastructure/Database.js';
import { AuthTokenService } from '../Shared/Infrastructure/AuthTokenService.js';
import { FuzzyLocation } from '../Discovery/Domain/FuzzyLocation.js';

async function seed() {
  console.log('--- Iniciando Seeding de Dados Realistas da Plataforma Enlace ---');
  const client = await dbPool.connect();

  try {
    await client.query('BEGIN');

    const passwordHash = await AuthTokenService.hashPassword('SenhaForte123!');

    // 1. Prestador 1: Juliana VIP (Rio Branco - AC, Bosque)
    const prov1Email = 'juliana.vip@enlace.app';
    let prov1Account = (await client.query('SELECT id FROM public.accounts WHERE email = $1', [prov1Email])).rows[0];

    if (!prov1Account) {
      const accRes = await client.query(
        `INSERT INTO public.accounts (email, phone_number, password_hash, role, verification_level)
         VALUES ($1, '5568999881122', $2, 'PROVIDER', 'LEVEL_3_VERIFIED_PROVIDER')
         RETURNING id`,
        [prov1Email, passwordHash]
      );
      prov1Account = accRes.rows[0];

      const fuzzy1 = FuzzyLocation.generateFuzzyCoordinates({ latitude: -9.974, longitude: -67.824 }, 500);

      const pRes = await client.query(
        `INSERT INTO public.provider_profiles (
           account_id, artistic_name, bio, state_uf, city, neighborhood, 
           fuzzy_geom, min_rate_cents, active_plan_tier, is_verified
         ) VALUES ($1, $2, $3, 'AC', 'Rio Branco', 'Bosque', ST_SetSRID(ST_MakePoint($4, $5), 4326), 25000, 'DIAMANTE', TRUE)
         RETURNING id`,
        [
          prov1Account.id,
          'Juliana VIP',
          'Atendimento carinhoso, empático e totalmente acessível para pessoas com deficiência física e surdos.',
          fuzzy1.longitude,
          fuzzy1.latitude
        ]
      );
      const prov1ProfileId = pRes.rows[0].id;

      // Ofertas de Acessibilidade
      await client.query(
        `INSERT INTO public.accessibility_offerings (provider_id, feature_code, details_text, is_verified)
         VALUES 
           ($1, 'COMM_LIBRAS', 'Certificado de Fluência em Libras CAS-AC', TRUE),
           ($1, 'MOB_RAMP_ELEVATOR', 'Espaço com rampa NBR 9050 e elevador privativo', TRUE)`,
        [prov1ProfileId]
      );

      // Mídia Digital Paywall
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
      console.log('✓ Prestadora Juliana VIP cadastrada com sucesso (Diamante, Libras, Rampa).');
    }

    // 2. Prestador 2: Lucas Moreno (Rio Branco - AC, Centro)
    const prov2Email = 'lucas.moreno@enlace.app';
    let prov2Account = (await client.query('SELECT id FROM public.accounts WHERE email = $1', [prov2Email])).rows[0];

    if (!prov2Account) {
      const accRes = await client.query(
        `INSERT INTO public.accounts (email, phone_number, password_hash, role, verification_level)
         VALUES ($1, '5568999773344', $2, 'PROVIDER', 'LEVEL_3_VERIFIED_PROVIDER')
         RETURNING id`,
        [prov2Email, passwordHash]
      );
      prov2Account = accRes.rows[0];

      const fuzzy2 = FuzzyLocation.generateFuzzyCoordinates({ latitude: -9.968, longitude: -67.815 }, 600);

      const pRes = await client.query(
        `INSERT INTO public.provider_profiles (
           account_id, artistic_name, bio, state_uf, city, neighborhood, 
           fuzzy_geom, min_rate_cents, active_plan_tier, is_verified
         ) VALUES ($1, $2, $3, 'AC', 'Rio Branco', 'Centro', ST_SetSRID(ST_MakePoint($4, $5), 4326), 20000, 'OURO', TRUE)
         RETURNING id`,
        [
          prov2Account.id,
          'Lucas Moreno',
          'Atendimento acolhedor, preparado para pessoas neurodivergentes, TEA e TDAH. Ritmo respeitado com consentimento explícito.',
          fuzzy2.longitude,
          fuzzy2.latitude
        ]
      );
      const prov2ProfileId = pRes.rows[0].id;

      await client.query(
        `INSERT INTO public.accessibility_offerings (provider_id, feature_code, details_text, is_verified)
         VALUES 
           ($1, 'NEURO_LIGHT_CONTROL', 'Controle gradual de intensidade luminosa para evitar sobrecarga sensorial', TRUE),
           ($1, 'NEURO_SILENT_SPACE', 'Ambiente com isolamento acústico e sem ruídos bruscos', TRUE)`,
        [prov2ProfileId]
      );
      console.log('✓ Prestador Lucas Moreno cadastrado com sucesso (Ouro, Neurodivergente, Ambiente Silencioso).');
    }

    // 3. Cliente de Demonstração
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
      console.log('✓ Cliente Demo Cliente_9942 cadastrado com sucesso.');
    }

    await client.query('COMMIT');
    console.log('--- Seeding Finalizado com Sucesso! ---');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro durante seeding:', err);
    throw err;
  } finally {
    client.release();
    await dbPool.end();
  }
}

seed().catch(() => process.exit(1));
