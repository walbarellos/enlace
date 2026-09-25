-- ============================================================================
-- PLATAFORMA ENLACE — DDL POSTGRESQL 16+
-- Script 03.03: Tabelas de Acessibilidade no Domínio e Compatibilidade
-- ============================================================================

-- 1. Tabela Mestra de Taxonomias de Acessibilidade
CREATE TABLE IF NOT EXISTS public.accessibility_taxonomies (
    feature_code VARCHAR(64) PRIMARY KEY,
    category VARCHAR(32) NOT NULL CHECK (category IN ('COMMUNICATION', 'MOBILITY', 'SENSORY', 'SUPPORT', 'NEURODIVERSITY', 'PROVIDER_PCD')),
    label_pt VARCHAR(128) NOT NULL,
    description_pt TEXT NOT NULL,
    is_critical_mobility BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- População das Categorias Iniciais Estruturais
INSERT INTO public.accessibility_taxonomies (feature_code, category, label_pt, description_pt, is_critical_mobility)
VALUES 
    ('COMM_LIBRAS', 'COMMUNICATION', 'Fluência em Libras', 'Acompanhante com fluência comunicativa em Língua Brasileira de Sinais', FALSE),
    ('COMM_TEXT_ONLY', 'COMMUNICATION', 'Atendimento Apenas por Texto', 'Comunicação e agendamento realizados estritamente por texto sem chamadas de voz', FALSE),
    ('COMM_CAA', 'COMMUNICATION', 'Comunicação Aumentativa / Pranchas', 'Familiaridade com Comunicação Alternativa e Aumentativa (símbolos e pranchas)', FALSE),
    ('MOB_RAMP_ELEVATOR', 'MOBILITY', 'Acesso com Rampa e Elevador', 'Local sem degraus impeditivos, com rampa suave ou elevador acessível', TRUE),
    ('MOB_WIDE_DOORS', 'MOBILITY', 'Portas e Corredores Largos', 'Vão livre de portas e passagens igual ou superior a 80 cm para cadeiras de rodas', TRUE),
    ('MOB_ADAPTED_BATHROOM', 'MOBILITY', 'Banheiro Adaptado', 'Banheiro com barras de apoio laterais e espaço de giro para cadeira de rodas', TRUE),
    ('MOB_TRANSFER_BED', 'MOBILITY', 'Cama com Altura de Transferência', 'Cama com altura compatível para transferência segura cadeira para cama', FALSE),
    ('MOB_HOME_VISIT', 'MOBILITY', 'Atende em Domicílio Adaptado', 'Disponibilidade para deslocamento até a residência com acessibilidade do cliente', FALSE),
    ('SUPP_GUIDE_DOG', 'SUPPORT', 'Aceite Pleno a Cão-Guia', 'Espaço adaptado e receptivo para cães-guia de assistência', FALSE),
    ('SUPP_CAREGIVER_ACCESS', 'SUPPORT', 'Aceite de Acompanhante / Cuidador', 'Autorização para presença prévia de cuidador para transferência e apoio inicial', FALSE),
    ('NEURO_LIGHT_CONTROL', 'NEURODIVERSITY', 'Iluminação Regulável e Suave', 'Ambiente com luminosidade dimerizável sem luzes estroboscópicas ou piscantes', FALSE),
    ('NEURO_SILENT_SPACE', 'NEURODIVERSITY', 'Ambiente Silencioso', 'Isolamento acústico ou ambiente tranquilo sem ruídos repentinos', FALSE),
    ('PROVIDER_PCD_MOTOR', 'PROVIDER_PCD', 'Acompanhante com Deficiência Motora', 'Acompanhante declara com orgulho suas características e comodidades motoras', FALSE),
    ('PROVIDER_PCD_SENSORY', 'PROVIDER_PCD', 'Acompanhante com Deficiência Sensorial', 'Acompanhante declara deficiência visual ou auditiva com autonomia e dignidade', FALSE)
ON CONFLICT (feature_code) DO NOTHING;

-- 2. Tabela de Comodidades Oferecidas pelo Prestador (Offerings)
CREATE TABLE IF NOT EXISTS public.accessibility_offerings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
    feature_code VARCHAR(64) NOT NULL REFERENCES public.accessibility_taxonomies(feature_code),
    details_text TEXT,
    is_self_attested BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (provider_id, feature_code)
);

CREATE INDEX idx_acc_offerings_provider ON public.accessibility_offerings(provider_id);
CREATE INDEX idx_acc_offerings_feature ON public.accessibility_offerings(feature_code);

-- 3. Tabela de Necessidades Funcionais do Cliente (Preferences)
CREATE TABLE IF NOT EXISTS public.accessibility_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.client_profiles(id) ON DELETE CASCADE,
    feature_code VARCHAR(64) NOT NULL REFERENCES public.accessibility_taxonomies(feature_code),
    priority_weight SMALLINT NOT NULL DEFAULT 3 CHECK (priority_weight BETWEEN 1 AND 5),
    is_mandatory_barrier BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (client_id, feature_code)
);

CREATE INDEX idx_acc_prefs_client ON public.accessibility_preferences(client_id);
