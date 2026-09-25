// ============================================================================
// PLATAFORMA ENLACE — DISCOVERY DOMAIN
// Arquivo: src/Discovery/Domain/FuzzyLocation.ts
// ============================================================================

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export class FuzzyLocation {
  private static readonly EARTH_RADIUS_METERS = 6371000;
  public static readonly MIN_FUZZY_DISTANCE_METERS = 500;

  /**
   * Calcula distância geodésica em metros através da fórmula de Haversine
   */
  public static calculateDistanceMeters(coord1: GeoCoordinates, coord2: GeoCoordinates): number {
    const lat1Rad = (coord1.latitude * Math.PI) / 180;
    const lat2Rad = (coord2.latitude * Math.PI) / 180;
    const deltaLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const deltaLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(this.EARTH_RADIUS_METERS * c);
  }

  /**
   * Gera coordenadas ofuscadas com dispersão estocástica garantida >= 500m
   */
  public static generateFuzzyCoordinates(
    realCoords: GeoCoordinates,
    randomSeedDistanceMeters: number = 550,
    randomAngleRad: number = Math.random() * 2 * Math.PI
  ): GeoCoordinates {
    const distanceMeters = Math.max(this.MIN_FUZZY_DISTANCE_METERS, randomSeedDistanceMeters);

    // Deslocamento angular em radianos
    const deltaLatRad = (distanceMeters / this.EARTH_RADIUS_METERS) * Math.cos(randomAngleRad);
    const deltaLonRad =
      (distanceMeters / (this.EARTH_RADIUS_METERS * Math.cos((realCoords.latitude * Math.PI) / 180))) *
      Math.sin(randomAngleRad);

    const fuzzedLat = realCoords.latitude + (deltaLatRad * 180) / Math.PI;
    const fuzzedLon = realCoords.longitude + (deltaLonRad * 180) / Math.PI;

    return {
      latitude: Math.round(fuzzedLat * 100000) / 100000,
      longitude: Math.round(fuzzedLon * 100000) / 100000
    };
  }
}
