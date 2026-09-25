// ============================================================================
// PLATAFORMA ENLACE — TESTES UNITÁRIOS DE DOMÍNIO
// Arquivo: tests/Commerce/SplitRule.spec.ts
// ============================================================================

import { describe, it, expect } from 'vitest';
import { SplitRule } from '../../src/Commerce/Domain/SplitRule.js';

describe('SplitRule (Invariante Contábil de Repasse Financeiro)', () => {
  it('deve calcular corretamente a divisão padrão 85% prestador e 15% taxa da plataforma', () => {
    // R$ 100,00 = 10000 centavos
    const res = SplitRule.calculate(10000);

    expect(res.isSuccess).toBe(true);
    const split = res.getValue();
    expect(split.totalCents).toBe(10000);
    expect(split.platformFeeCents).toBe(1500); // R$ 15,00
    expect(split.providerNetCents).toBe(8500); // R$ 85,00
    expect(split.platformFeeCents + split.providerNetCents).toBe(10000);
  });

  it('deve manter a paridade matemática de centavos mesmo com dízimas periódicas (ex: R$ 49,99 = 4999 centavos)', () => {
    // 4999 * 0.15 = 749.85 -> arredonda para 750 centavos
    // 4999 - 750 = 4249 centavos
    const res = SplitRule.calculate(4999);

    expect(res.isSuccess).toBe(true);
    const split = res.getValue();
    expect(split.platformFeeCents).toBe(750);
    expect(split.providerNetCents).toBe(4249);
    // Invariante inquebrável
    expect(split.platformFeeCents + split.providerNetCents).toBe(4999);
  });

  it('deve rejeitar valores não inteiros ou menores ou iguais a zero', () => {
    expect(SplitRule.calculate(0).isSuccess).toBe(false);
    expect(SplitRule.calculate(-500).isSuccess).toBe(false);
    expect(SplitRule.calculate(49.99).isSuccess).toBe(false);
  });
});
