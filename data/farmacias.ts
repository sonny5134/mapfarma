// data/farmacias.ts
import { Farmacia } from '../types';

// TODO: reemplazar por datos reales (API propia, o consulta a un backend con las farmacias de turno de Pilar)
export const farmacias: Farmacia[] = [
  {
    id: 'farm-1',
    nombre: 'Farmacia Pilar Centro',
    direccion: 'Ruta 8 Km 54, Local 3',
    barrio: 'Del Solar',
    telefono: '0230 443-2800',
    latitud: -34.4587,
    longitud: -58.9137,
    distanciaMetros: 318,
    enTurno: true,
    horaCierreTurno: '28h 10m',
    rating: 4.5,
  },
  {
    id: 'farm-2',
    nombre: 'Farmacia Vita',
    direccion: 'Intendente Urigüen 340',
    barrio: 'Pilar Centro',
    telefono: '0230 443-5510',
    latitud: -34.4601,
    longitud: -58.9145,
    distanciaMetros: 496,
    enTurno: true,
    horaCierreTurno: '28h 10m',
    rating: 4.8,
  },
  {
    id: 'farm-3',
    nombre: 'Farmacia del Sol',
    direccion: 'Av. Pte. Perón 1250',
    barrio: 'Centro',
    telefono: '0230 443-1200',
    latitud: -34.4579,
    longitud: -58.9102,
    distanciaMetros: 231,
    enTurno: false,
    rating: 4.7,
  },
];
