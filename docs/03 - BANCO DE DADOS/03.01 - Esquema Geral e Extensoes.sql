-- ============================================================================
-- PLATAFORMA ENLACE — DDL POSTGRESQL 16+
-- Script 03.01: Extensões, Esquemas e Tipos Enumerados Globais
-- ============================================================================

-- 1. Habilitação de Extensões Obrigatórias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Criação de Esquemas de Isolamento
CREATE SCHEMA IF NOT EXISTS public;
CREATE SCHEMA IF NOT EXISTS vault_civil;

-- Comentários dos Esquemas
COMMENT ON SCHEMA public IS 'Esquema público para dados operacionais, perfis sociais, catálogo e ordens';
COMMENT ON SCHEMA vault_civil IS 'Cofre criptografado isolado para dados de identidade civil legal e KYC (Acesso restrito)';

-- 3. Tipos Enumerados Globais (Enums)

-- Papéis do Sistema (RBAC)
DO $$ BEGIN
    CREATE TYPE public.account_role_enum AS ENUM (
        'CLIENT',
        'PROVIDER',
        'MODERATOR',
        'SUPPORT',
        'ADMIN',
        'AUDITOR'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Níveis Escalonados de Verificação
DO $$ BEGIN
    CREATE TYPE public.verification_level_enum AS ENUM (
        'LEVEL_0_VISITOR',
        'LEVEL_1_BASIC',
        'LEVEL_2_VERIFIED_CLIENT',
        'LEVEL_3_VERIFIED_PROVIDER',
        'LEVEL_4_FEATURED_PROVIDER'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Status da Conta
DO $$ BEGIN
    CREATE TYPE public.account_status_enum AS ENUM (
        'ACTIVE',
        'PENDING_VERIFICATION',
        'QUARANTINED',
        'SUSPENDED',
        'DELETED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Modalidades de Atendimento
DO $$ BEGIN
    CREATE TYPE public.service_location_mode_enum AS ENUM (
        'OWN_PLACE',
        'CLIENT_PLACE',
        'HOTEL_MOTEL',
        'VIRTUAL'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tiers de Acesso a Mídia
DO $$ BEGIN
    CREATE TYPE public.media_access_tier_enum AS ENUM (
        'PUBLIC_TEASER',
        'PAYWALL_SINGLE',
        'SUBSCRIBER_ONLY',
        'BUNDLE_ONLY'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Status de Ordens Financeiras
DO $$ BEGIN
    CREATE TYPE public.order_status_enum AS ENUM (
        'PENDING_PAYMENT',
        'PAID',
        'PROCESSING_MEDIA',
        'DELIVERED',
        'FAILED',
        'REFUNDED',
        'EXPIRED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Planos de Destaque para Prestadores
DO $$ BEGIN
    CREATE TYPE public.subscription_tier_enum AS ENUM (
        'FREE',
        'BRONZE',
        'PRATA',
        'OURO',
        'DIAMANTE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Função Utilitária para Atualização Automática de 'updated_at'
CREATE OR REPLACE FUNCTION public.set_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
