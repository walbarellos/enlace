// ============================================================================
// PLATAFORMA ENLACE — TESTES UNITÁRIOS DE DOMÍNIO
// Arquivo: tests/Accessibility/AccessibilityMatchEngine.spec.ts
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
  AccessibilityMatchEngine,
  ClientRequirement,
  ProviderAccommodation
} from '../../src/Accessibility/Domain/AccessibilityMatchEngine.js';

describe('AccessibilityMatchEngine (Motor de Compatibilidade Funcional)', () => {
  it('deve retornar 100% de compatibilidade quando o prestador atende todas as exigências do cliente', () => {
    const requirements: ClientRequirement[] = [
      { featureCode: 'COMM_LIBRAS', weight: 5, isMandatoryBarrier: false },
      { featureCode: 'MOB_RAMP_ELEVATOR', weight: 5, isMandatoryBarrier: true },
      { featureCode: 'NEURO_LIGHT_CONTROL', weight: 3, isMandatoryBarrier: false }
    ];

    const accommodations: ProviderAccommodation[] = [
      { featureCode: 'COMM_LIBRAS', isSelfAttested: true, isVerified: true },
      { featureCode: 'MOB_RAMP_ELEVATOR', isSelfAttested: true, isVerified: true },
      { featureCode: 'NEURO_LIGHT_CONTROL', isSelfAttested: true, isVerified: false },
      { featureCode: 'COMM_TEXT_ONLY', isSelfAttested: true, isVerified: false } // extra
    ];

    const result = AccessibilityMatchEngine.computeMatch(requirements, accommodations);

    expect(result.scorePercentage).toBe(100.0);
    expect(result.isFullMatch).toBe(true);
    expect(result.isVetoedByCriticalBarrier).toBe(false);
    expect(result.matchedFeatureCodes).toHaveLength(3);
    expect(result.missingFeatureCodes).toHaveLength(0);
  });

  it('deve aplicar VETO CRÍTICO (Score = 0%) quando uma barreira física mandatória estiver ausente', () => {
    const requirements: ClientRequirement[] = [
      { featureCode: 'MOB_RAMP_ELEVATOR', weight: 5, isMandatoryBarrier: true }, // Crítico!
      { featureCode: 'COMM_TEXT_ONLY', weight: 2, isMandatoryBarrier: false }
    ];

    // Prestador oferece apenas texto, mas NÃO tem rampa/elevador
    const accommodations: ProviderAccommodation[] = [
      { featureCode: 'COMM_TEXT_ONLY', isSelfAttested: true, isVerified: true }
    ];

    const result = AccessibilityMatchEngine.computeMatch(requirements, accommodations);

    expect(result.scorePercentage).toBe(0.0);
    expect(result.isFullMatch).toBe(false);
    expect(result.isVetoedByCriticalBarrier).toBe(true);
    expect(result.reason).toContain('Impedimento crítico funcional');
    expect(result.missingFeatureCodes).toContain('MOB_RAMP_ELEVATOR');
  });

  it('deve calcular afinidade ponderada parcial quando comodidades não-críticas estiverem ausentes', () => {
    const requirements: ClientRequirement[] = [
      { featureCode: 'COMM_LIBRAS', weight: 4, isMandatoryBarrier: false }, // atendido (peso 4)
      { featureCode: 'NEURO_SILENT_SPACE', weight: 1, isMandatoryBarrier: false } // ausente (peso 1)
    ]; // total weight = 5. earned = 4. score = (4/5) * 100 = 80%

    const accommodations: ProviderAccommodation[] = [
      { featureCode: 'COMM_LIBRAS', isSelfAttested: true, isVerified: true }
    ];

    const result = AccessibilityMatchEngine.computeMatch(requirements, accommodations);

    expect(result.scorePercentage).toBe(80.0);
    expect(result.isFullMatch).toBe(false);
    expect(result.isVetoedByCriticalBarrier).toBe(false);
    expect(result.matchedFeatureCodes).toEqual(['COMM_LIBRAS']);
    expect(result.missingFeatureCodes).toEqual(['NEURO_SILENT_SPACE']);
  });

  it('deve retornar 100% neutro se o cliente não especificou nenhum requisito de acessibilidade', () => {
    const result = AccessibilityMatchEngine.computeMatch([], []);

    expect(result.scorePercentage).toBe(100.0);
    expect(result.isFullMatch).toBe(true);
    expect(result.isVetoedByCriticalBarrier).toBe(false);
  });
});
