-- ============================================================================
-- PLATAFORMA ENLACE — DDL POSTGRESQL 16+
-- Script 03.05: Tabelas Financeiras, Ordens de Compra, Split e Outbox
-- ============================================================================

-- 1. Tabela Mestra de Ordens de Compra (Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE RESTRICT,
    provider_profile_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE RESTRICT,
    content_asset_id UUID REFERENCES public.content_assets(id) ON DELETE SET NULL,
    item_type VARCHAR(32) NOT NULL CHECK (item_type IN ('MEDIA_SINGLE', 'SUBSCRIPTION_TIER', 'BUNDLE_PACK')),
    total_cents INTEGER NOT NULL CHECK (total_cents > 0),
    platform_fee_cents INTEGER NOT NULL CHECK (platform_fee_cents >= 0),
    provider_net_cents INTEGER NOT NULL CHECK (provider_net_cents >= 0),
    payment_method VARCHAR(16) NOT NULL CHECK (payment_method IN ('PIX', 'CREDIT_CARD')),
    status public.order_status_enum NOT NULL DEFAULT 'PENDING_PAYMENT',
    pix_copia_cola TEXT,
    pix_qr_code_url VARCHAR(512),
    gateway_transaction_id VARCHAR(128) UNIQUE,
    gateway_idempotency_key VARCHAR(128) NOT NULL UNIQUE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Invariante Financeira Absoluta: A soma das partes deve ser estritamente igual ao total bruto
    CONSTRAINT chk_order_split_exact_sum CHECK (total_cents = platform_fee_cents + provider_net_cents)
);

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_column();

CREATE INDEX idx_orders_client ON public.orders(client_account_id, status);
CREATE INDEX idx_orders_provider ON public.orders(provider_profile_id, status);
CREATE INDEX idx_orders_idempotency ON public.orders(gateway_idempotency_key);

-- 2. Tabela de Assinaturas de Destaque para Acompanhantes (Subscriptions)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_profile_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    tier public.subscription_tier_enum NOT NULL CHECK (tier != 'FREE'),
    duration_days INTEGER NOT NULL CHECK (duration_days IN (7, 15, 30)),
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    auto_renew BOOLEAN NOT NULL DEFAULT FALSE,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_active ON public.subscriptions(provider_profile_id, expires_at, status);

-- 3. Tabela de Livro-Razão de Repasses Pix (Payout Ledger)
CREATE TABLE IF NOT EXISTS public.payout_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE RESTRICT,
    provider_profile_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE RESTRICT,
    amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
    pix_key_masked VARCHAR(64) NOT NULL, -- Chave Pix com mascaramento visual
    gateway_transfer_id VARCHAR(128) NOT NULL UNIQUE,
    status VARCHAR(32) NOT NULL DEFAULT 'SETTLED' CHECK (status IN ('SETTLED', 'FAILED', 'PENDING')),
    settled_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabela de Eventos de Domínio Confiáveis (Transactional Outbox)
CREATE TABLE IF NOT EXISTS public.outbox_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aggregate_type VARCHAR(64) NOT NULL,
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(128) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSED', 'FAILED')),
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX idx_outbox_pending ON public.outbox_events(status, created_at) WHERE status = 'PENDING';
