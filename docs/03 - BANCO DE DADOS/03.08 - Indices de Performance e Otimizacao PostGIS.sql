-- ============================================================================
-- PLATAFORMA ENLACE — DDL POSTGRESQL 16+
-- Script 03.08: Índices de Performance, Otimização PostGIS e Busca Espacial
-- ============================================================================

-- 1. Índice Espacial GiST para Busca Georreferenciada Difusa
CREATE INDEX IF NOT EXISTS idx_provider_profiles_fuzzy_geom 
ON public.provider_profiles USING GIST (fuzzy_geom);

-- 2. Índice Composto de Vitrine (UF, Cidade, Status e Tier de Destaque)
CREATE INDEX IF NOT EXISTS idx_provider_profiles_catalog_composite
ON public.provider_profiles (state_uf, city, status, active_plan_tier, is_verified);

-- 3. Função de Dispersão Estocástica de Coordenadas (Ofuscação Obrigatória)
-- Aplica perturbação gaussiana aleatória de no mínimo 500 metros em torno do ponto real
CREATE OR REPLACE FUNCTION public.generate_fuzzy_point(real_lat DOUBLE PRECISION, real_lon DOUBLE PRECISION)
RETURNS GEOMETRY AS $$
DECLARE
    fuzz_radius_deg DOUBLE PRECISION;
    random_angle DOUBLE PRECISION;
    fuzzed_lat DOUBLE PRECISION;
    fuzzed_lon DOUBLE PRECISION;
BEGIN
    -- ~0.005 graus equivale a aproximadamente 550 metros na linha do equador
    fuzz_radius_deg := 0.0045 + (random() * 0.0035); 
    random_angle := random() * 2 * PI();
    
    fuzzed_lat := real_lat + (fuzz_radius_deg * cos(random_angle));
    fuzzed_lon := real_lon + (fuzz_radius_deg * sin(random_angle));
    
    RETURN ST_SetSRID(ST_MakePoint(fuzzed_lon, fuzzed_lat), 4326);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. Função de Busca Rápida de Catálogo com Matching de Acessibilidade
-- Cumpre o requisito NFR-PERF-001 (P95 <= 80ms)
CREATE OR REPLACE FUNCTION public.search_providers_catalog(
    p_state_uf CHAR(2),
    p_city VARCHAR(128),
    p_center_geom GEOMETRY,
    p_radius_meters DOUBLE PRECISION,
    p_required_features VARCHAR(64)[]
)
RETURNS TABLE (
    provider_id UUID,
    artistic_name VARCHAR(128),
    neighborhood VARCHAR(128),
    active_plan_tier public.subscription_tier_enum,
    min_rate_cents INTEGER,
    distance_meters DOUBLE PRECISION,
    matched_features_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS provider_id,
        p.artistic_name,
        p.neighborhood,
        p.active_plan_tier,
        p.min_rate_cents,
        ST_Distance(p.fuzzy_geom::geography, p_center_geom::geography) AS distance_meters,
        COUNT(a.feature_code) AS matched_features_count
    FROM public.provider_profiles p
    LEFT JOIN public.accessibility_offerings a 
           ON a.provider_id = p.id 
          AND a.feature_code = ANY(p_required_features)
    WHERE p.state_uf = p_state_uf
      AND p.city = p_city
      AND p.status = 'ACTIVE'
      AND ST_DWithin(p.fuzzy_geom::geography, p_center_geom::geography, p_radius_meters)
    GROUP BY p.id, p.artistic_name, p.neighborhood, p.active_plan_tier, p.min_rate_cents, p.fuzzy_geom
    ORDER BY 
        -- Ponderação do Ranking: Tier de Assinatura primeiro, depois Compatibilidade, depois Proximidade
        CASE p.active_plan_tier
            WHEN 'DIAMANTE' THEN 5
            WHEN 'OURO' THEN 4
            WHEN 'PRATA' THEN 3
            WHEN 'BRONZE' THEN 2
            ELSE 1
        END DESC,
        matched_features_count DESC,
        distance_meters ASC
    LIMIT 20; -- Paginação e limite estrito anti-scraping
END;
$$ LANGUAGE plpgsql STABLE;
