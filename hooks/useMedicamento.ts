// hooks/useMedicamento.ts
import { useState, useEffect, useCallback } from 'react';
import { Medicamento } from '../types';
import { medicamentos as MEDICAMENTOS_MOCK } from '../data/medicamentos';

interface UseMedicamentoResult {
  medicamento: Medicamento | undefined;
  cargando: boolean;
}

// DetalleScreen (lee el id de la URL) -> useMedicamento(id) -> mockData
// En la Clase 5 el TODO de abajo se reemplaza por una consulta real a Firebase,
// sin tener que tocar la pantalla de detalle.
export function useMedicamento(id: string | undefined): UseMedicamentoResult {
  const [medicamento, setMedicamento] = useState<Medicamento | undefined>(undefined);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(() => {
    setCargando(true);
    setTimeout(() => {
      // TODO: reemplazar por fetch a Firebase usando el id, en la Clase 5.
      setMedicamento(MEDICAMENTOS_MOCK.find((m) => m.id === id));
      setCargando(false);
    }, 300);
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { medicamento, cargando };
}
