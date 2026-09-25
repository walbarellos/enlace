// ============================================================================
// PLATAFORMA ENLACE — SHARED DOMAIN
// Arquivo: src/Shared/Domain/PolicyDecision.ts
// ============================================================================

export class PolicyDecision {
  private constructor(
    public readonly isAllowed: boolean,
    public readonly reason?: string,
    public readonly code?: string
  ) {}

  public static allow(): PolicyDecision {
    return new PolicyDecision(true);
  }

  public static deny(reason: string, code: string = 'ACCESS_DENIED'): PolicyDecision {
    return new PolicyDecision(false, reason, code);
  }
}
