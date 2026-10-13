// hooks/useMisProductos.ts
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Medicamento } from '../types';

interface UseMisProductosResult {
  productos: Medicamento[];
  cargando: boolean;
}

export function useMisProductos(uid: string | undefined): UseMisProductosResult {
  const [productos, setProductos] = useState<Medicamento[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!uid) {
      setCargando(false);
      return;
    }

    const q = query(collection(db, 'medicamentos'), where('userId', '==', uid));

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Medicamento, 'id'>),
      }));
      setProductos(data);
      setCargando(false);
    });

    return unsub;
  }, [uid]);

  return { productos, cargando };
}
