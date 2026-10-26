// hooks/useMisProductos.ts
import { useEffect, useState } from 'react';
import { medicamentosService } from '../services/firestoreMedicamentos';
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

    const cancelar = medicamentosService.subscribeByUser(
      uid,
      (data) => {
        setProductos(data);
        setCargando(false);
      },
      () => setCargando(false)
    );

    return cancelar;
  }, [uid]);

  return { productos, cargando };
}
