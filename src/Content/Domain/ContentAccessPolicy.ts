// ============================================================================
// PLATAFORMA ENLACE — CONTENT DOMAIN
// Arquivo: src/Content/Domain/ContentAccessPolicy.ts
// ============================================================================

import { PolicyDecision } from '../../Shared/Domain/PolicyDecision.js';

export type MediaAccessTier = 'PUBLIC_TEASER' | 'PAYWALL_SINGLE' | 'SUBSCRIBER_ONLY' | 'BUNDLE_ONLY';

export interface ContentResourceSnapshot {
  id: string;
  providerAccountId: string;
  tier: MediaAccessTier;
  isActive: boolean;
  status: string;
}

export interface EntitlementSnapshot {
  id: string;
  accountId: string;
  contentAssetId: string;
  isRevoked: boolean;
  expiresAt?: Date | null;
}

export class ContentAccessPolicy {
  public static canAccess(
    userAccountId: string,
    resource: ContentResourceSnapshot,
    userEntitlement?: EntitlementSnapshot | null,
    referenceDate: Date = new Date()
  ): PolicyDecision {
    if (!resource.isActive || resource.status !== 'ACTIVE') {
      return PolicyDecision.deny('Conteúdo multimídia indisponível ou em processamento', 'CONTENT_UNAVAILABLE');
    }

    // Regra 1: Conteúdo público (teaser) é aberto a todos
    if (resource.tier === 'PUBLIC_TEASER') {
      return PolicyDecision.allow();
    }

    // Regra 2: O próprio prestador proprietário tem acesso irrestrito
    if (userAccountId === resource.providerAccountId) {
      return PolicyDecision.allow();
    }

    // Regra 3: Requer Entitlement válido
    if (!userEntitlement) {
      return PolicyDecision.deny(
        'Acesso bloqueado por paywall. É necessário adquirir o item via Pix.',
        'ENTITLEMENT_REQUIRED'
      );
    }

    if (userEntitlement.isRevoked) {
      return PolicyDecision.deny(
        'O direito de acesso a esta mídia foi revogado pela moderação.',
        'ENTITLEMENT_REVOKED'
      );
    }

    if (userEntitlement.expiresAt && userEntitlement.expiresAt < referenceDate) {
      return PolicyDecision.deny(
        'O período de acesso contratado para este conteúdo expirou.',
        'ENTITLEMENT_EXPIRED'
      );
    }

    return PolicyDecision.allow();
  }
}
