import { puedePublicar } from '../utils/permisos';

describe('puedePublicar (RF-006, RF-015, RF-019)', () => {
  it('permite publicar solo al rol Desarrollador', () => {
    expect(puedePublicar('Desarrollador')).toBe(true);
  });

  it('no permite publicar a un Cliente', () => {
    expect(puedePublicar('Cliente')).toBe(false);
  });

  it('no permite publicar a los otros roles del equipo', () => {
    expect(puedePublicar('Diseñador')).toBe(false);
    expect(puedePublicar('Líder de proyecto')).toBe(false);
  });

  it('no permite publicar sin rol definido', () => {
    expect(puedePublicar(undefined)).toBe(false);
    expect(puedePublicar(null)).toBe(false);
  });
});
