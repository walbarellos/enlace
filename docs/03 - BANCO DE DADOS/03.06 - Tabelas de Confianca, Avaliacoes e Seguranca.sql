-- ============================================================================
-- PLATAFORMA ENLACE — DDL POSTGRESQL 16+
-- Script 03.06: Tabelas de Confiança, Avaliações Bilaterais e Segurança
-- ============================================================================

-- 1. Tabela de Solicitações Estruturadas de Atendimento (Service Requests)
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_profile_id UUID NOT NULL REFERENCES public.client_profiles(id) ON DELETE CASCADE,
    provider_profile_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    requested_datetime TIMESTAMPTZ NOT NULL,
    duration_hours SMALLINT NOT NULL CHECK (duration_hours BETWEEN 1 AND 24),
    location_mode public.service_location_mode_enum NOT NULL,
    requested_accommodations JSONB NOT NULL DEFAULT '[]'::jsonb,
    external_channel_type VARCHAR(16) NOT NULL CHECK (external_channel_type IN ('WHATSAPP', 'TELEGRAM', 'PHONE')),
    status VARCHAR(32) NOT NULL DEFAULT 'FORWARDED' CHECK (status IN ('FORWARDED', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_requests_client ON public.service_requests(client_profile_id);
CREATE INDEX idx_requests_provider ON public.service_requests(provider_profile_id);

-- 2. Tabela de Avaliações Bilaterais (Reviews com Janela Cega)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
    author_account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    target_account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    author_type VARCHAR(32) NOT NULL CHECK (author_type IN ('CLIENT_TO_PROVIDER', 'PROVIDER_TO_CLIENT')),
    rating_score SMALLINT NOT NULL CHECK (rating_score BETWEEN 1 AND 5),
    public_comment TEXT,
    is_published BOOLEAN NOT NULL DEFAULT FALSE, -- Fica falso até ambos avaliarem ou expirar janela de 7 dias
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (service_request_id, author_type)
);

CREATE INDEX idx_reviews_target ON public.reviews(target_account_id, is_published, rating_score);

-- 3. Tabela do Canal Confidencial de Segurança (Alerta Sigiloso de Risco)
CREATE TABLE IF NOT EXISTS public.confidential_safety_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    target_account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    incident_code VARCHAR(64) NOT NULL CHECK (incident_code IN ('CONSENT_BREACH', 'VERBAL_AGGRESSION', 'PHYSICAL_AGGRESSION', 'SCAM_ATTEMPT', 'UNAUTHORIZED_RECORDING', 'UNDERAGE_SUSPICION')),
    risk_weight SMALLINT NOT NULL DEFAULT 5 CHECK (risk_weight BETWEEN 1 AND 10),
    encrypted_narrative BYTEA, -- Relato criptografado para perícia interna
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_safety_target ON public.confidential_safety_logs(target_account_id, incident_code, created_at);

-- 4. Tabela de Registros de Quarentena Preventiva (Quarantine Records)
CREATE TABLE IF NOT EXISTS public.quarantine_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_profile_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    quarantine_reason VARCHAR(255) NOT NULL,
    accumulated_strikes SMALLINT NOT NULL DEFAULT 3,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'LIFTED', 'BANNED_CONFIRMED')),
    imposed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    auditor_account_id UUID REFERENCES public.accounts(id)
);

CREATE INDEX idx_quarantine_active ON public.quarantine_records(target_profile_id, status);

-- 5. Tabela de Bloqueio Mútuo Preventivo (Mutual Blocks)
CREATE TABLE IF NOT EXISTS public.mutual_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocker_account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    blocked_account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    reason VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (blocker_account_id, blocked_account_id),
    CONSTRAINT chk_no_self_block CHECK (blocker_account_id != blocked_account_id)
);

CREATE INDEX idx_blocks_lookup ON public.mutual_blocks(blocker_account_id, blocked_account_id);
