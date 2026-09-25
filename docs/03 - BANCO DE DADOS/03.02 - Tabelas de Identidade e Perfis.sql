-- ============================================================================
-- PLATAFORMA ENLACE — DDL POSTGRESQL 16+
-- Script 03.02: Tabelas de Identidade (Accounts) e Perfis Sociais
-- ============================================================================

-- 1. Tabela Base de Contas (Accounts)
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(32),
    password_hash VARCHAR(255) NOT NULL,
    role public.account_role_enum NOT NULL DEFAULT 'CLIENT',
    verification_level public.verification_level_enum NOT NULL DEFAULT 'LEVEL_1_BASIC',
    status public.account_status_enum NOT NULL DEFAULT 'ACTIVE',
    mfa_secret VARCHAR(128),
    is_mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger de updated_at para accounts
CREATE TRIGGER trg_accounts_updated_at
BEFORE UPDATE ON public.accounts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_column();

-- Comentários de Governança
COMMENT ON TABLE public.accounts IS 'Contas base de autenticação. Não contém nomes civis ou dados sociais públicos';

-- 2. Tabela de Perfis de Clientes (Client Profiles com Pseudônimo Obrigatório)
CREATE TABLE IF NOT EXISTS public.client_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL UNIQUE REFERENCES public.accounts(id) ON DELETE CASCADE,
    pseudonym VARCHAR(64) NOT NULL UNIQUE,
    avatar_preset VARCHAR(64) DEFAULT 'avatar_default_1',
    functional_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_pseudonym_format CHECK (pseudonym ~* '^Cliente_[0-9]{4,6}$')
);

CREATE TRIGGER trg_client_profiles_updated_at
BEFORE UPDATE ON public.client_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_column();

COMMENT ON TABLE public.client_profiles IS 'Perfil público de clientes. O pseudônimo garante o anonimato compulsório';

-- 3. Tabela de Perfis de Acompanhantes (Provider Profiles)
CREATE TABLE IF NOT EXISTS public.provider_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL UNIQUE REFERENCES public.accounts(id) ON DELETE CASCADE,
    artistic_name VARCHAR(128) NOT NULL,
    bio TEXT,
    state_uf CHAR(2) NOT NULL,
    city VARCHAR(128) NOT NULL,
    neighborhood VARCHAR(128) NOT NULL,
    fuzzy_geom GEOMETRY(Point, 4326) NOT NULL,
    min_rate_cents INTEGER NOT NULL DEFAULT 0,
    accepted_locations public.service_location_mode_enum[] NOT NULL DEFAULT ARRAY['OWN_PLACE']::public.service_location_mode_enum[],
    active_plan_tier public.subscription_tier_enum NOT NULL DEFAULT 'FREE',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    status public.account_status_enum NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_min_rate_non_negative CHECK (min_rate_cents >= 0)
);

CREATE TRIGGER trg_provider_profiles_updated_at
BEFORE UPDATE ON public.provider_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_column();

COMMENT ON TABLE public.provider_profiles IS 'Vitrine pública de acompanhantes. Endereço exato NUNCA é armazenado aqui; apenas fuzzy_geom';

-- 4. Tabela de Disponibilidade e Agenda Semanal (Provider Availability)
CREATE TABLE IF NOT EXISTS public.provider_availabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Domingo, 6=Sábado
    shift VARCHAR(16) NOT NULL CHECK (shift IN ('MORNING', 'AFTERNOON', 'NIGHT', 'DAWN')),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    is_instant_now BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (provider_id, day_of_week, shift)
);

CREATE INDEX idx_provider_avail_day_shift ON public.provider_availabilities(provider_id, is_available);
