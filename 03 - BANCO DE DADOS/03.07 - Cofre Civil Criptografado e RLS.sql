-- ============================================================================
-- PLATAFORMA ENLACE — DDL POSTGRESQL 16+
-- Script 03.07: Cofre Civil Criptografado, Auditoria e Row-Level Security (RLS)
-- ============================================================================

-- 1. Tabela do Cofre Civil Isolado (vault_civil.identities)
CREATE TABLE IF NOT EXISTS vault_civil.identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL UNIQUE REFERENCES public.accounts(id) ON DELETE CASCADE,
    encrypted_full_legal_name BYTEA NOT NULL, -- Criptografado AES-256-GCM via KMS
    encrypted_cpf BYTEA NOT NULL,             -- Criptografado AES-256-GCM
    encrypted_birth_date BYTEA NOT NULL,      -- Criptografado AES-256-GCM
    encrypted_pix_key BYTEA NOT NULL,         -- Criptografado AES-256-GCM
    cpf_blind_index VARCHAR(64) NOT NULL,     -- HMAC-SHA256(CPF, Salt) para busca única sem expor CPF
    liveness_score NUMERIC(5, 2) NOT NULL CHECK (liveness_score BETWEEN 0.00 AND 100.00),
    document_front_s3_key VARCHAR(512) NOT NULL,
    document_back_s3_key VARCHAR(512),
    selfie_liveness_s3_key VARCHAR(512) NOT NULL,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    rejection_reason VARCHAR(255),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_vault_identities_updated_at
BEFORE UPDATE ON vault_civil.identities
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_column();

-- Índice sobre o Blind Index do CPF (Impede cadastro duplicado de CPF sem guardar texto claro)
CREATE UNIQUE INDEX idx_vault_cpf_blind ON vault_civil.identities(cpf_blind_index);

COMMENT ON TABLE vault_civil.identities IS 'Cofre criptografado de dados civis legais. Estritamente inacessível pela API web comum';

-- 2. Tabela de Trilha de Auditoria Imutável do Cofre (Append-Only)
CREATE TABLE IF NOT EXISTS vault_civil.access_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    actor_identifier VARCHAR(128) NOT NULL, -- Ex: "worker-kyc-instance-1" ou "auditor_marcos"
    action_type VARCHAR(64) NOT NULL CHECK (action_type IN ('VERIFICATION_EVALUATION', 'PAYOUT_OWNERSHIP_CHECK', 'COURT_ORDER_EXPORT')),
    justification_code VARCHAR(128) NOT NULL,
    accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Configuração de Permissões e Row-Level Security (RLS)

-- Criação dos Papéis de Banco (Se não existirem)
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'enlace_app_user') THEN
        CREATE ROLE enlace_app_user WITH LOGIN PASSWORD 'app_secure_password_dev';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'enlace_vault_worker_user') THEN
        CREATE ROLE enlace_vault_worker_user WITH LOGIN PASSWORD 'vault_worker_secure_password_dev';
    END IF;
END $$;

-- Garantir que a aplicação web comum NÃO enxergue o cofre civil
REVOKE ALL ON SCHEMA vault_civil FROM PUBLIC;
REVOKE ALL ON SCHEMA vault_civil FROM enlace_app_user;

-- Conceder acesso ao cofre APENAS para o worker de KYC
GRANT USAGE ON SCHEMA vault_civil TO enlace_vault_worker_user;
GRANT SELECT, INSERT, UPDATE ON TABLE vault_civil.identities TO enlace_vault_worker_user;
GRANT INSERT ON TABLE vault_civil.access_audits TO enlace_vault_worker_user;

-- Habilitação formal de RLS
ALTER TABLE vault_civil.identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_civil.access_audits ENABLE ROW LEVEL SECURITY;

-- Política de RLS: Apenas sessões autenticadas como worker têm permissão
DROP POLICY IF EXISTS p_vault_worker_access ON vault_civil.identities;
CREATE POLICY p_vault_worker_access ON vault_civil.identities
    FOR ALL
    TO enlace_vault_worker_user
    USING (TRUE)
    WITH CHECK (TRUE);
