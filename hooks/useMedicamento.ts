// hooks/useMedicamento.ts — Lectura individual (una sola vez, no en tiempo real)
import { useEffect, useState } from 'react';
import { medicamentosService } from '../services/firestoreMedicamentos';
import { Medicamento } from '../types';

interface UseMedicamentoResult {
  medicamento: Medicamento | null;
  cargando: boolean;
  error: string | null;
}

export function useMedicamento(id: string | undefined): UseMedicamentoResult {
  const [medicamento, setMedicamento] = useState<Medicamento | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setCargando(false);
      return;
    }

    // Flag local para no actualizar el estado si el usuario ya navegó hacia
    // atrás y el componente se desmontó antes de que la promesa resuelva.
    let mounted = true;

    setCargando(true);
    medicamentosService
      .getById(id)
      .then((data) => {
        if (mounted) setMedicamento(data);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setCargando(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  return { medicamento, cargando, error };
}
