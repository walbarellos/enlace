// ============================================================================
// PLATAFORMA ENLACE — TESTES UNITÁRIOS DE DOMÍNIO
// Arquivo: tests/Discovery/FuzzyLocation.spec.ts
// ============================================================================

import { describe, it, expect } from 'vitest';
import { FuzzyLocation, GeoCoordinates } from '../../src/Discovery/Domain/FuzzyLocation.js';

describe('FuzzyLocation (Ofuscação Obrigatória de Coordenadas Geográficas)', () => {
  // Ponto de teste no Centro de Rio Branco - AC
  const realCoordinates: GeoCoordinates = {
    latitude: -9.97499,
    longitude: -67.8243
  };

  it('deve calcular a distância geodésica corretamente entre duas coordenadas conhecidas', () => {
    // Ponto a ~1000m de distância
    const secondPoint: GeoCoordinates = {
      latitude: -9.96599,
      longitude: -67.8243
    };

    const distance = FuzzyLocation.calculateDistanceMeters(realCoordinates, secondPoint);
    expect(distance).toBeGreaterThanOrEqual(950);
    expect(distance).toBeLessThanOrEqual(1050);
  });

  it('deve garantir que as coordenadas ofuscadas estejam sempre a no mínimo 500 metros de distância do ponto real', () => {
    // Testa 10 ângulos ao redor de todo o círculo (360 graus)
    for (let i = 0; i < 10; i++) {
      const angleRad = (i / 10) * 2 * Math.PI;
      const fuzzed = FuzzyLocation.generateFuzzyCoordinates(realCoordinates, 550, angleRad);

      const actualDistance = FuzzyLocation.calculateDistanceMeters(realCoordinates, fuzzed);

      // A distância deve resguardar a privacidade física do prestador (>= 500m)
      expect(actualDistance).toBeGreaterThanOrEqual(500);

      // O ponto ofuscado nunca pode coincidir com o ponto real
      const hasMoved = fuzzed.latitude !== realCoordinates.latitude || fuzzed.longitude !== realCoordinates.longitude;
      expect(hasMoved).toBe(true);
    }
  });
});
