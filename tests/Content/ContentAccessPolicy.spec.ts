// ============================================================================
// PLATAFORMA ENLACE — TESTES UNITÁRIOS DE DOMÍNIO
// Arquivo: tests/Content/ContentAccessPolicy.spec.ts
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
  ContentAccessPolicy,
  ContentResourceSnapshot,
  EntitlementSnapshot
} from '../../src/Content/Domain/ContentAccessPolicy.js';

describe('ContentAccessPolicy (Controle Estrutural de Paywall & Entitlements)', () => {
  const providerAccountId = 'provider-uuid-1111';
  const buyerAccountId = 'buyer-uuid-2222';
  const randomUserId = 'random-uuid-3333';
  const referenceDate = new Date('2026-09-25T12:00:00Z');

  const publicTeaserResource: ContentResourceSnapshot = {
    id: 'asset-pub-1',
    providerAccountId,
    tier: 'PUBLIC_TEASER',
    isActive: true,
    status: 'ACTIVE'
  };

  const paywallResource: ContentResourceSnapshot = {
    id: 'asset-pay-2',
    providerAccountId,
    tier: 'PAYWALL_SINGLE',
    isActive: true,
    status: 'ACTIVE'
  };

  it('deve autorizar qualquer usuário a visualizar conteúdo público (teaser)', () => {
    const decision = ContentAccessPolicy.canAccess(randomUserId, publicTeaserResource, null);
    expect(decision.isAllowed).toBe(true);
  });

  it('deve autorizar o próprio acompanhante proprietário a acessar sua mídia privada sem entitlement', () => {
    const decision = ContentAccessPolicy.canAccess(providerAccountId, paywallResource, null);
    expect(decision.isAllowed).toBe(true);
  });

  it('deve bloquear usuário sem entitlement ativo em mídia sob paywall', () => {
    const decision = ContentAccessPolicy.canAccess(buyerAccountId, paywallResource, null);
    expect(decision.isAllowed).toBe(false);
    expect(decision.code).toBe('ENTITLEMENT_REQUIRED');
  });

  it('deve autorizar usuário que possui entitlement perpétuo válido', () => {
    const validEntitlement: EntitlementSnapshot = {
      id: 'ent-1',
      accountId: buyerAccountId,
      contentAssetId: paywallResource.id,
      isRevoked: false,
      expiresAt: null // Perpétuo
    };

    const decision = ContentAccessPolicy.canAccess(buyerAccountId, paywallResource, validEntitlement);
    expect(decision.isAllowed).toBe(true);
  });

  it('deve bloquear usuário cujo entitlement foi revogado pela moderação', () => {
    const revokedEntitlement: EntitlementSnapshot = {
      id: 'ent-2',
      accountId: buyerAccountId,
      contentAssetId: paywallResource.id,
      isRevoked: true,
      expiresAt: null
    };

    const decision = ContentAccessPolicy.canAccess(buyerAccountId, paywallResource, revokedEntitlement);
    expect(decision.isAllowed).toBe(false);
    expect(decision.code).toBe('ENTITLEMENT_REVOKED');
  });

  it('deve bloquear usuário cujo período de assinatura do conteúdo expirou', () => {
    const expiredEntitlement: EntitlementSnapshot = {
      id: 'ent-3',
      accountId: buyerAccountId,
      contentAssetId: paywallResource.id,
      isRevoked: false,
      expiresAt: new Date('2026-09-20T00:00:00Z') // expirou há 5 dias
    };

    const decision = ContentAccessPolicy.canAccess(
      buyerAccountId,
      paywallResource,
      expiredEntitlement,
      referenceDate
    );
    expect(decision.isAllowed).toBe(false);
    expect(decision.code).toBe('ENTITLEMENT_EXPIRED');
  });
});
