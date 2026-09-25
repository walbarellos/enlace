import { dbPool } from '../../Shared/Infrastructure/Database.js';
import { Result } from '../../Shared/Domain/Result.js';
import { AgePolicy } from '../Domain/AgePolicy.js';
import { Pseudonym } from '../Domain/Pseudonym.js';
import { FuzzyLocation } from '../../Discovery/Domain/FuzzyLocation.js';
import { AuthTokenService } from '../../Shared/Infrastructure/AuthTokenService.js';
import type { RegisterAccountDTO } from '../../Shared/Presentation/ValidationSchemas.js';

export interface RegisterOutput {
  accountId: string;
  email: string;
  role: 'CLIENT' | 'PROVIDER';
  pseudonym?: string;
  artisticName?: string;
  token: string;
}

export class RegisterAccountUseCase {
  public static async execute(dto: RegisterAccountDTO): Promise<Result<RegisterOutput>> {
    // 1. Verificação estrita de maioridade (+18)
    const birthDate = new Date(dto.birth_date);
    if (isNaN(birthDate.getTime())) {
      return Result.fail('Data de nascimento inválida');
    }

    const ageDecision = AgePolicy.canRegister(birthDate);
    if (!ageDecision.isAllowed) {
      return Result.fail(ageDecision.reason || 'Idade incompatível com os termos de uso');
    }

    const client = await dbPool.connect();

    try {
      await client.query('BEGIN');

      // Verifica duplicidade de e-mail
      const existing = await client.query('SELECT id FROM public.accounts WHERE email = $1', [dto.email]);
      if (existing.rows.length > 0) {
        await client.query('ROLLBACK');
        return Result.fail('E-mail já cadastrado na plataforma');
      }

      // Hash de senha seguro
      const passwordHash = await AuthTokenService.hashPassword(dto.password);

      if (dto.role === 'CLIENT') {
        const accountRes = await client.query(
          `INSERT INTO public.accounts (email, phone_number, password_hash, role, verification_level)
           VALUES ($1, $2, $3, 'CLIENT', 'LEVEL_1_BASIC')
           RETURNING id, role, verification_level`,
          [dto.email, dto.phone_number || null, passwordHash]
        );
        const account = accountRes.rows[0];

        // Gera pseudônimo determinístico e anônimo derivado da conta
        const pseudonymObj = Pseudonym.generateFromAccountId(account.id);
        const pseudonym = pseudonymObj.value;

        await client.query(
          `INSERT INTO public.client_profiles (account_id, pseudonym)
           VALUES ($1, $2)`,
          [account.id, pseudonym]
        );

        await client.query('COMMIT');

        const token = AuthTokenService.generateToken({
          accountId: account.id,
          role: 'CLIENT',
          pseudonym,
          verificationLevel: account.verification_level
        });

        return Result.ok({
          accountId: account.id,
          email: dto.email,
          role: 'CLIENT',
          pseudonym,
          token
        });
      } else {
        // Papel: PROVIDER
        if (!dto.artistic_name || !dto.state_uf || !dto.city || !dto.neighborhood) {
          await client.query('ROLLBACK');
          return Result.fail('Dados obrigatórios do perfil de prestador não preenchidos (nome artístico, UF, cidade, bairro)');
        }

        const lat = dto.latitude ?? -9.974; // Fallback Rio Branco se omitido
        const lon = dto.longitude ?? -67.824;

        // Ofuscação estocástica obrigatória (privacidade do local do prestador)
        const fuzzyCoords = FuzzyLocation.generateFuzzyCoordinates({ latitude: lat, longitude: lon }, 550);

        const accountRes = await client.query(
          `INSERT INTO public.accounts (email, phone_number, password_hash, role, verification_level)
           VALUES ($1, $2, $3, 'PROVIDER', 'LEVEL_1_BASIC')
           RETURNING id, role, verification_level`,
          [dto.email, dto.phone_number || null, passwordHash]
        );
        const account = accountRes.rows[0];

        await client.query(
          `INSERT INTO public.provider_profiles (
             account_id, artistic_name, state_uf, city, neighborhood, fuzzy_geom, min_rate_cents
           ) VALUES (
             $1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($6, $7), 4326), $8
           )`,
          [
            account.id,
            dto.artistic_name,
            dto.state_uf.toUpperCase(),
            dto.city,
            dto.neighborhood,
            fuzzyCoords.longitude,
            fuzzyCoords.latitude,
            dto.min_rate_cents || 0
          ]
        );

        await client.query('COMMIT');

        const token = AuthTokenService.generateToken({
          accountId: account.id,
          role: 'PROVIDER',
          artisticName: dto.artistic_name,
          verificationLevel: account.verification_level
        });

        return Result.ok({
          accountId: account.id,
          email: dto.email,
          role: 'PROVIDER',
          artisticName: dto.artistic_name,
          token
        });
      }
    } catch (err: any) {
      await client.query('ROLLBACK');
      return Result.fail(`Erro ao registrar conta: ${err.message}`);
    } finally {
      client.release();
    }
  }
}
