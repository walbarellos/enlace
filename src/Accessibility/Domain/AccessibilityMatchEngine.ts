// ============================================================================
// PLATAFORMA ENLACE — ACCESSIBILITY DOMAIN
// Arquivo: src/Accessibility/Domain/AccessibilityMatchEngine.ts
// ============================================================================

export interface ClientRequirement {
  featureCode: string;
  weight: number; // 1 a 5
  isMandatoryBarrier: boolean; // ex: Rampa de acesso
}

export interface ProviderAccommodation {
  featureCode: string;
  isSelfAttested: boolean;
  isVerified: boolean;
}

export interface MatchResult {
  scorePercentage: number;
  isFullMatch: boolean;
  isVetoedByCriticalBarrier: boolean;
  matchedFeatureCodes: string[];
  missingFeatureCodes: string[];
  reason?: string;
}

export class AccessibilityMatchEngine {
  public static computeMatch(
    requirements: ClientRequirement[],
    accommodations: ProviderAccommodation[]
  ): MatchResult {
    // Se o cliente não possui exigências ativas de acessibilidade, o match é 100% neutro
    if (!requirements || requirements.length === 0) {
      return {
        scorePercentage: 100.0,
        isFullMatch: true,
        isVetoedByCriticalBarrier: false,
        matchedFeatureCodes: [],
        missingFeatureCodes: []
      };
    }

    const offeredSet = new Set(accommodations.map(a => a.featureCode));
    const matchedFeatures: string[] = [];
    const missingFeatures: string[] = [];

    let totalWeight = 0;
    let earnedWeight = 0;
    let hasCriticalVeto = false;
    let vetoReason: string | undefined;

    for (const req of requirements) {
      const weight = Math.max(1, Math.min(5, req.weight));
      totalWeight += weight;

      if (offeredSet.has(req.featureCode)) {
        earnedWeight += weight;
        matchedFeatures.push(req.featureCode);
      } else {
        missingFeatures.push(req.featureCode);
        if (req.isMandatoryBarrier) {
          hasCriticalVeto = true;
          vetoReason = `Impedimento crítico funcional: acomodação obrigatória ausente [${req.featureCode}].`;
        }
      }
    }

    if (hasCriticalVeto) {
      return {
        scorePercentage: 0.0,
        isFullMatch: false,
        isVetoedByCriticalBarrier: true,
        matchedFeatureCodes: matchedFeatures,
        missingFeatureCodes: missingFeatures,
        reason: vetoReason
      };
    }

    const calculatedScore = totalWeight > 0 ? (earnedWeight / totalWeight) * 100.0 : 100.0;
    const roundedScore = Math.round(calculatedScore * 100) / 100;

    return {
      scorePercentage: roundedScore,
      isFullMatch: roundedScore === 100.0,
      isVetoedByCriticalBarrier: false,
      matchedFeatureCodes: matchedFeatures,
      missingFeatureCodes: missingFeatures
    };
  }
}
