import { dbPool } from '../../Shared/Infrastructure/Database.js';
import { Result } from '../../Shared/Domain/Result.js';
import { AuthTokenService } from '../../Shared/Infrastructure/AuthTokenService.js';
import type { LoginDTO } from '../../Shared/Presentation/ValidationSchemas.js';

export interface LoginOutput {
  accountId: string;
  email: string;
  role: 'CLIENT' | 'PROVIDER' | 'MODERATOR' | 'ADMIN';
  pseudonym?: string;
  artisticName?: string;
  profileId?: string;
  token: string;
}

export class LoginUseCase {
  public static async execute(dto: LoginDTO): Promise<Result<LoginOutput>> {
    try {
      const res = await dbPool.query(
        `SELECT id, email, password_hash, role, verification_level, status
         FROM public.accounts
         WHERE email = $1`,
        [dto.email]
      );

      if (res.rows.length === 0) {
        return Result.fail('Credenciais inválidas ou conta inexistente');
      }

      const account = res.rows[0];

      if (account.status !== 'ACTIVE') {
        return Result.fail(`Conta suspensa ou inativa (${account.status})`);
      }

      const isPasswordValid = await AuthTokenService.comparePassword(dto.password, account.password_hash);
      if (!isPasswordValid) {
        return Result.fail('Credenciais inválidas');
      }

      let pseudonym: string | undefined;
      let artisticName: string | undefined;
      let profileId: string | undefined;

      if (account.role === 'CLIENT') {
        const clientProfile = await dbPool.query(
          'SELECT id, pseudonym FROM public.client_profiles WHERE account_id = $1',
          [account.id]
        );
        if (clientProfile.rows.length > 0) {
          pseudonym = clientProfile.rows[0].pseudonym;
          profileId = clientProfile.rows[0].id;
        }
      } else if (account.role === 'PROVIDER') {
        const providerProfile = await dbPool.query(
          'SELECT id, artistic_name FROM public.provider_profiles WHERE account_id = $1',
          [account.id]
        );
        if (providerProfile.rows.length > 0) {
          artisticName = providerProfile.rows[0].artistic_name;
          profileId = providerProfile.rows[0].id;
        }
      }

      const token = AuthTokenService.generateToken({
        accountId: account.id,
        role: account.role,
        pseudonym,
        artisticName,
        verificationLevel: account.verification_level
      });

      return Result.ok({
        accountId: account.id,
        email: account.email,
        role: account.role,
        pseudonym,
        artisticName,
        profileId,
        token
      });
    } catch (err: any) {
      return Result.fail(`Erro na autenticação: ${err.message}`);
    }
  }
}
