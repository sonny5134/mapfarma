// hooks/useFarmacias.ts — Sincronización en tiempo real con Firestore
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
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
    const q = query(collection(db, 'farmacias'), orderBy('nombre', 'asc'));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Farmacia, 'id'>),
        }));
        setFarmacias(data);
        setCargando(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setCargando(false);
      }
    );

    return unsub;
  }, []);

  return { farmacias, cargando, error };
}
