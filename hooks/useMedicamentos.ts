// hooks/useMedicamentos.ts — Sincronización en tiempo real con Firestore
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Medicamento } from '../types';

interface UseMedicamentosResult {
  medicamentos: Medicamento[];
  cargando: boolean;
  error: string | null;
}

// HomeScreen -> useMedicamentos (este hook) -> Firestore ('medicamentos')
// onSnapshot deja la suscripción abierta: si cualquiera edita un documento desde
// la consola de Firebase, la lista se actualiza sola, sin pull-to-refresh manual.
export function useMedicamentos(): UseMedicamentosResult {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'medicamentos'), orderBy('nombre', 'asc'));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Medicamento, 'id'>),
        }));
        setMedicamentos(data);
        setCargando(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setCargando(false);
      }
    );

    // cleanup: cancela la suscripción al desmontar (evita fugas de memoria)
    return unsub;
  }, []);

  return { medicamentos, cargando, error };
}
