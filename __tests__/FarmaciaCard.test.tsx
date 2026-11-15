import { render } from '@testing-library/react-native';
import { FarmaciaCard } from '../components/FarmaciaCard';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Farmacia } from '../types';

const base: Farmacia = {
  id: 'f1', nombre: 'Farmacia Vita', direccion: 'Intendente Urigüen 340', barrio: 'Pilar Centro',
  telefono: '0230 443-5512', latitud: -34.45, longitud: -58.91, enTurno: true, rating: 4.8,
};

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('FarmaciaCard (D-23)', () => {
  it('sin ubicación real no muestra distancia', async () => {
    const r = await render(<ThemeProvider><FarmaciaCard farmacia={base} /></ThemeProvider>);
    expect(r.queryByText(/ m$/)).toBeNull();
  });
  it('con ubicación real muestra la distancia', async () => {
    const r = await render(<ThemeProvider><FarmaciaCard farmacia={{ ...base, distanciaMetros: 318 }} /></ThemeProvider>);
    expect(r.getByText('318 m')).toBeTruthy();
  });
});
