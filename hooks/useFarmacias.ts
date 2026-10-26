// hooks/useFarmacias.ts
import { useEffect, useState } from 'react';
import { farmaciasService } from '../services/firestoreFarmacias';
import { Farmacia } from '../types';

interface UseFarmaciasResult {
  farmacias: Farmacia[];
  cargando: boolean;
  error: string | null;
}

export function useFarmacias(): UseFarmaciasResult {
  const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cancelar = farmaciasService.subscribeAll(
      (data) => {
        setFarmacias(data);
        setCargando(false);
        setError(null);
      },
      (mensaje) => {
        setError(mensaje);
        setCargando(false);
      }
    );

    return cancelar;
  }, []);

  return { farmacias, cargando, error };
}
