// __tests__/distancia.test.ts
import { calcularDistanciaMetros } from '../utils/distancia';

describe('calcularDistanciaMetros (Haversine)', () => {
  it('devuelve 0 si los dos puntos son iguales', () => {
    expect(calcularDistanciaMetros(-34.4587, -58.9137, -34.4587, -58.9137)).toBe(0);
  });

  it('es simétrica: ir de A a B mide lo mismo que de B a A', () => {
    const ida = calcularDistanciaMetros(-34.4587, -58.9137, -34.4601, -58.9145);
    const vuelta = calcularDistanciaMetros(-34.4601, -58.9145, -34.4587, -58.9137);
    expect(ida).toBe(vuelta);
  });

  it('calcula una distancia razonable entre dos farmacias de Pilar (cientos de metros)', () => {
    const d = calcularDistanciaMetros(-34.4587, -58.9137, -34.4601, -58.9145);
    expect(d).toBeGreaterThan(100);
    expect(d).toBeLessThan(500);
  });
});
