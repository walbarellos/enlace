// ============================================================================
// PLATAFORMA ENLACE — IDENTITY DOMAIN
// Arquivo: src/Identity/Domain/AgePolicy.ts
// ============================================================================

import { PolicyDecision } from '../../Shared/Domain/PolicyDecision.js';

export class AgePolicy {
  public static calculateAge(birthDate: Date, referenceDate: Date = new Date()): number {
    let age = referenceDate.getUTCFullYear() - birthDate.getUTCFullYear();
    const monthDiff = referenceDate.getUTCMonth() - birthDate.getUTCMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getUTCDate() < birthDate.getUTCDate())) {
      age--;
    }
    
    return age;
  }

  public static canRegister(
    birthDate: Date,
    isBlacklisted: boolean = false,
    referenceDate: Date = new Date()
  ): PolicyDecision {
    if (isBlacklisted) {
      return PolicyDecision.deny(
        'Documento ou identidade consta em lista restritiva de segurança',
        'DOCUMENT_BLACKLISTED'
      );
    }

    const calculatedAge = this.calculateAge(birthDate, referenceDate);

    if (calculatedAge < 18) {
      return PolicyDecision.deny(
        `Cadastro estritamente proibido para menores de 18 anos. Idade calculada: ${calculatedAge} anos.`,
        'AGE_UNDER_18_PROHIBITED'
      );
    }

    return PolicyDecision.allow();
  }
}
