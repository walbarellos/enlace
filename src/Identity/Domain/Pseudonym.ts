// ============================================================================
// PLATAFORMA ENLACE — IDENTITY DOMAIN
// Arquivo: src/Identity/Domain/Pseudonym.ts
// ============================================================================

import { Result } from '../../Shared/Domain/Result.js';
import { createHmac } from 'crypto';

export class Pseudonym {
  private static readonly REGEX_FORMAT = /^Cliente_[0-9]{4,6}$/;

  private constructor(public readonly value: string) {}

  public static fromValue(value: string): Result<Pseudonym, string> {
    if (!value || !this.REGEX_FORMAT.test(value)) {
      return Result.fail(`Pseudônimo inválido: "${value}". O formato deve seguir estritamente o padrão 'Cliente_XXXX' (4 a 6 dígitos).`);
    }
    return Result.ok(new Pseudonym(value));
  }

  public static generateFromAccountId(accountId: string, salt: string = 'enlace_static_pepper_v1'): Pseudonym {
    const hmac = createHmac('sha256', salt);
    hmac.update(accountId);
    const digestHex = hmac.digest('hex');
    
    // Extrai 4 dígitos a partir do hash gerando um número consistente entre 1000 e 9999
    const numberComponent = (parseInt(digestHex.substring(0, 8), 16) % 9000) + 1000;
    return new Pseudonym(`Cliente_${numberComponent}`);
  }

  public toString(): string {
    return this.value;
  }
}
