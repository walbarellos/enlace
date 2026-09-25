// ============================================================================
// PLATAFORMA ENLACE — TESTES UNITÁRIOS DE DOMÍNIO
// Arquivo: tests/Identity/AgePolicy.spec.ts
// ============================================================================

import { describe, it, expect } from 'vitest';
import { AgePolicy } from '../../src/Identity/Domain/AgePolicy.js';

describe('AgePolicy (Domínio de Identidade & Maioridade +18)', () => {
  const referenceDate = new Date('2026-09-25T12:00:00Z');

  it('deve aprovar usuário que completou exatamente 18 anos hoje', () => {
    const birthDate = new Date('2008-09-25T00:00:00Z');
    const decision = AgePolicy.canRegister(birthDate, false, referenceDate);

    expect(decision.isAllowed).toBe(true);
    expect(decision.reason).toBeUndefined();
  });

  it('deve aprovar usuário com mais de 18 anos (ex: 25 anos)', () => {
    const birthDate = new Date('2001-05-10T00:00:00Z');
    const decision = AgePolicy.canRegister(birthDate, false, referenceDate);

    expect(decision.isAllowed).toBe(true);
  });

  it('deve rejeitar e barrar usuário que completa 18 anos amanhã (17 anos e 364 dias)', () => {
    const birthDate = new Date('2008-09-26T00:00:00Z');
    const decision = AgePolicy.canRegister(birthDate, false, referenceDate);

    expect(decision.isAllowed).toBe(false);
    expect(decision.code).toBe('AGE_UNDER_18_PROHIBITED');
    expect(decision.reason).toContain('Idade calculada: 17 anos');
  });

  it('deve rejeitar menor de idade de 15 anos', () => {
    const birthDate = new Date('2011-03-15T00:00:00Z');
    const decision = AgePolicy.canRegister(birthDate, false, referenceDate);

    expect(decision.isAllowed).toBe(false);
    expect(decision.code).toBe('AGE_UNDER_18_PROHIBITED');
  });

  it('deve barrar documento que conste na lista negra preventiva mesmo que seja maior de idade', () => {
    const birthDate = new Date('1998-01-01T00:00:00Z');
    const decision = AgePolicy.canRegister(birthDate, true, referenceDate);

    expect(decision.isAllowed).toBe(false);
    expect(decision.code).toBe('DOCUMENT_BLACKLISTED');
    expect(decision.reason).toContain('lista restritiva');
  });
});
