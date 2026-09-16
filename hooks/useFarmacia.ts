// hooks/useFarmacia.ts — Lectura individual (una sola vez, no en tiempo real)
import { useEffect, useState } from 'react';
import { farmaciasService } from '../services/firestoreFarmacias';
import { Farmacia } from '../types';

interface UseFarmaciaResult {
  farmacia: Farmacia | null;
  cargando: boolean;
}

export function useFarmacia(id: string | undefined): UseFarmaciaResult {
  const [farmacia, setFarmacia] = useState<Farmacia | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) {
      setCargando(false);
      return;
    }

    let mounted = true;
    setCargando(true);
    farmaciasService
      .getById(id)
      .then((data) => {
        if (mounted) setFarmacia(data);
      })
      .finally(() => {
        if (mounted) setCargando(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  return { farmacia, cargando };
}
