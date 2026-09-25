-- ============================================================================
-- PLATAFORMA ENLACE — DDL POSTGRESQL 16+
-- Script 03.04: Tabelas de Conteúdo Digital, Paywall e Entitlements
-- ============================================================================

-- 1. Tabela de Ativos de Mídia (Content Assets)
CREATE TABLE IF NOT EXISTS public.content_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    media_type VARCHAR(16) NOT NULL CHECK (media_type IN ('PHOTO', 'VIDEO')),
    access_tier public.media_access_tier_enum NOT NULL DEFAULT 'PAYWALL_SINGLE',
    price_cents INTEGER NOT NULL DEFAULT 0,
    title VARCHAR(128),
    description TEXT,
    original_s3_key VARCHAR(512) NOT NULL,
    processed_s3_key VARCHAR(512),
    hls_playlist_s3_key VARCHAR(512),
    thumbnail_blur_s3_key VARCHAR(512) NOT NULL,
    perceptual_hash VARCHAR(64) NOT NULL,
    duration_seconds INTEGER DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'PROCESSING' CHECK (status IN ('PROCESSING', 'ACTIVE', 'BLOCKED', 'DELETED')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_price_non_negative CHECK (price_cents >= 0)
);

CREATE TRIGGER trg_content_assets_updated_at
BEFORE UPDATE ON public.content_assets
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_column();

CREATE INDEX idx_content_assets_provider ON public.content_assets(provider_id, access_tier, status);
CREATE INDEX idx_content_assets_phash ON public.content_assets(perceptual_hash);

-- 2. Tabela de Direitos de Acesso Granulares (Entitlements)
CREATE TABLE IF NOT EXISTS public.entitlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    content_asset_id UUID NOT NULL REFERENCES public.content_assets(id) ON DELETE CASCADE,
    entitlement_type VARCHAR(32) NOT NULL CHECK (entitlement_type IN ('PERPETUAL_SINGLE', 'SUBSCRIPTION', 'BUNDLE_GRANT', 'PROMOTIONAL_PASS')),
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ, -- Nulo para PERPETUAL_SINGLE
    order_id UUID,          -- Vinculado à ordem de compra
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_reason VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (account_id, content_asset_id)
);

CREATE INDEX idx_entitlements_account_asset ON public.entitlements(account_id, content_asset_id, is_revoked);

-- 3. Tabela de Log de Acesso Forense e Esteganografia (Content Access Logs)
CREATE TABLE IF NOT EXISTS public.content_access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    content_asset_id UUID NOT NULL REFERENCES public.content_assets(id) ON DELETE CASCADE,
    watermark_identifier VARCHAR(64) NOT NULL, -- Pseudônimo injetado
    playback_session_token VARCHAR(255) NOT NULL,
    accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_access_logs_asset_date ON public.content_access_logs(content_asset_id, accessed_at);
