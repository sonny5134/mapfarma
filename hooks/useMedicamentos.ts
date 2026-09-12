// hooks/useMedicamentos.ts
import { useState, useEffect, useCallback } from 'react';
import { Medicamento } from '../types';
import { medicamentos as MEDICAMENTOS_MOCK } from '../data/medicamentos';

interface UseMedicamentosResult {
  medicamentos: Medicamento[];
  cargando: boolean;
  error: string | null;
  refrescar: () => void;
}

// Capas: HomeScreen (interfaz) -> useMedicamentos (estado) -> mockData (datos locales)
// En la Clase 5 el "TODO" de acá abajo se reemplaza por una consulta real a Firebase,
// sin tener que tocar la interfaz que ya construimos.
export function useMedicamentos(): UseMedicamentosResult {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() => {
    setCargando(true);
    setError(null);
    // Simula una carga de datos (latencia de red).
    setTimeout(() => {
      // TODO: reemplazar por fetch/consulta real a Firebase en la Clase 5.
      setMedicamentos(MEDICAMENTOS_MOCK);
      setCargando(false);
    }, 500);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { medicamentos, cargando, error, refrescar: cargar };
}
