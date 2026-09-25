import { dbPool } from '../../Shared/Infrastructure/Database.js';
import { Result } from '../../Shared/Domain/Result.js';
import type { ProviderSearchQueryDTO } from '../../Shared/Presentation/ValidationSchemas.js';

export interface ProviderSearchResultItem {
  providerId: string;
  artisticName: string;
  stateUf: string;
  city: string;
  neighborhood: string;
  activePlanTier: string;
  minRateCents: number;
  distanceMeters: number | null;
  matchedFeaturesCount: number;
  accessibilityFeatures: string[];
  acceptedLocations: string[];
}

export class SearchProvidersUseCase {
  public static async execute(query: ProviderSearchQueryDTO): Promise<Result<ProviderSearchResultItem[]>> {
    try {
      const lat = query.lat ?? -9.974;
      const lon = query.lon ?? -67.824;
      const radiusMeters = query.radius_meters ?? 50000.0;
      const accommodations = query.accommodations || [];

      // 1. Invoca a função otimizada com PostGIS
      const searchRes = await dbPool.query(
        `SELECT 
           sp.provider_id,
           sp.artistic_name,
           sp.neighborhood,
           sp.active_plan_tier,
           sp.min_rate_cents,
           ROUND(sp.distance_meters::numeric, 0) as distance_meters,
           sp.matched_features_count,
           p.accepted_locations
         FROM public.search_providers_catalog(
           $1,
           $2,
           ST_SetSRID(ST_MakePoint($3, $4), 4326),
           $5,
           $6::VARCHAR[]
         ) sp
         JOIN public.provider_profiles p ON p.id = sp.provider_id
         LIMIT $7`,
        [
          query.state_uf.toUpperCase(),
          query.city,
          lon,
          lat,
          radiusMeters,
          accommodations,
          query.limit || 20
        ]
      );

      if (searchRes.rows.length === 0) {
        return Result.ok([]);
      }

      const providerIds = searchRes.rows.map((r) => r.provider_id);

      // 2. Busca todas as features de acessibilidade associadas aos prestadores encontrados
      const featRes = await dbPool.query(
        `SELECT provider_id, feature_code
         FROM public.accessibility_offerings
         WHERE provider_id = ANY($1::UUID[])`,
        [providerIds]
      );

      const featuresByProvider = new Map<string, string[]>();
      for (const row of featRes.rows) {
        if (!featuresByProvider.has(row.provider_id)) {
          featuresByProvider.set(row.provider_id, []);
        }
        featuresByProvider.get(row.provider_id)!.push(row.feature_code);
      }

      const items: ProviderSearchResultItem[] = searchRes.rows.map((row) => ({
        providerId: row.provider_id,
        artisticName: row.artistic_name,
        stateUf: query.state_uf.toUpperCase(),
        city: query.city,
        neighborhood: row.neighborhood,
        activePlanTier: row.active_plan_tier,
        minRateCents: row.min_rate_cents,
        distanceMeters: row.distance_meters !== null ? Number(row.distance_meters) : null,
        matchedFeaturesCount: Number(row.matched_features_count),
        accessibilityFeatures: featuresByProvider.get(row.provider_id) || [],
        acceptedLocations: row.accepted_locations || ['OWN_PLACE']
      }));

      return Result.ok(items);
    } catch (err: any) {
      return Result.fail(`Falha na busca de prestadores: ${err.message}`);
    }
  }
}
