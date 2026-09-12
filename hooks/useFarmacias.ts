// hooks/useFarmacias.ts
import { useState, useEffect, useCallback } from 'react';
import { Farmacia } from '../types';
import { farmacias as FARMACIAS_MOCK } from '../data/farmacias';

interface UseFarmaciasResult {
  farmacias: Farmacia[];
  cargando: boolean;
  error: string | null;
  refrescar: () => void;
}

export function useFarmacias(): UseFarmaciasResult {
  const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() => {
    setCargando(true);
    setError(null);
    setTimeout(() => {
      // TODO: reemplazar por fetch/consulta real (backend propio o Firebase) en clases futuras.
      setFarmacias(FARMACIAS_MOCK);
      setCargando(false);
    }, 500);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { farmacias, cargando, error, refrescar: cargar };
}
