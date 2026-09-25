// ============================================================================
// PLATAFORMA ENLACE — COMMERCE DOMAIN
// Arquivo: src/Commerce/Domain/SplitRule.ts
// ============================================================================

import { Result } from '../../Shared/Domain/Result.js';

export interface SplitCalculation {
  totalCents: number;
  platformFeeCents: number;
  providerNetCents: number;
  platformRatePercentage: number;
  providerRatePercentage: number;
}

export class SplitRule {
  public static readonly DEFAULT_PLATFORM_RATE = 0.15; // 15%
  public static readonly DEFAULT_PROVIDER_RATE = 0.85; // 85%

  public static calculate(
    totalCents: number,
    platformRate: number = this.DEFAULT_PLATFORM_RATE
  ): Result<SplitCalculation, string> {
    if (!Number.isInteger(totalCents) || totalCents <= 0) {
      return Result.fail(`O valor total deve ser um número inteiro positivo em centavos. Recebido: ${totalCents}`);
    }

    if (platformRate < 0 || platformRate > 1) {
      return Result.fail(`Taxa de comissionamento inválida: ${platformRate}. Deve estar entre 0.0 e 1.0.`);
    }

    // Calcula com arredondamento preciso para centavos inteiros
    const platformFeeCents = Math.round(totalCents * platformRate);
    const providerNetCents = totalCents - platformFeeCents;

    // Invariante Matemática Absoluta de Integridade Contábil
    if (totalCents !== platformFeeCents + providerNetCents) {
      return Result.fail('Falha de consistência matemática no cálculo do split: divergência de centavos.');
    }

    return Result.ok({
      totalCents,
      platformFeeCents,
      providerNetCents,
      platformRatePercentage: Math.round(platformRate * 100),
      providerRatePercentage: Math.round((1 - platformRate) * 100)
    });
  }
}
