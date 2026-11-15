// utils/filtrarMedicamentos.ts
// Misma lógica que usaba la Home inline: se extrajo para poder testearla sin montar la pantalla.
import { Medicamento } from '../types';

export function filtrarMedicamentos(
  medicamentos: Medicamento[],
  busqueda: string,
  categoriaActiva: string
): Medicamento[] {
  return medicamentos.filter((m) => {
    const coincideCategoria = categoriaActiva === 'Todos' || m.categoria === categoriaActiva;
    const coincideBusqueda = m.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });
}
