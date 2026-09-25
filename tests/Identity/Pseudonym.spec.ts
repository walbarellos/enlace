// ============================================================================
// PLATAFORMA ENLACE — TESTES UNITÁRIOS DE DOMÍNIO
// Arquivo: tests/Identity/Pseudonym.spec.ts
// ============================================================================

import { describe, it, expect } from 'vitest';
import { Pseudonym } from '../../src/Identity/Domain/Pseudonym.js';

describe('Pseudonym (Value Object de Anonimato)', () => {
  it('deve aceitar e instanciar pseudônimos válidos com formato Cliente_XXXX', () => {
    const res1 = Pseudonym.fromValue('Cliente_1001');
    const res2 = Pseudonym.fromValue('Cliente_94821');

    expect(res1.isSuccess).toBe(true);
    expect(res1.getValue().value).toBe('Cliente_1001');

    expect(res2.isSuccess).toBe(true);
    expect(res2.getValue().value).toBe('Cliente_94821');
  });

  it('deve rejeitar nomes civis, e-mails ou formatos que quebrem o anonimato', () => {
    const invalidValues = [
      'Marcos Silva',
      'marcos@email.com',
      'Cliente_12',         // menos de 4 dígitos
      'Cliente_12345678',   // mais de 6 dígitos
      'User_1234',          // prefixo errado
      '',
      'cliente_1234'        // minúsculo não permitido
    ];

    for (const val of invalidValues) {
      const res = Pseudonym.fromValue(val);
      expect(res.isSuccess).toBe(false);
    }
  });

  it('deve gerar pseudônimo determinístico consistente a partir do UUID da conta', () => {
    const accountId = 'a4b1c2d3-1111-4444-8888-abcdef123456';
    const pseud1 = Pseudonym.generateFromAccountId(accountId);
    const pseud2 = Pseudonym.generateFromAccountId(accountId);

    expect(pseud1.value).toBe(pseud2.value);
    expect(pseud1.value).toMatch(/^Cliente_[1-9][0-9]{3}$/);
  });
});
