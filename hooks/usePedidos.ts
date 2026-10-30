// hooks/usePedidos.ts
import { useEffect, useState } from 'react';
import { pedidosService } from '../services/pedidosService';
import { Pedido } from '../types';

export function usePedidos(uid: string | undefined) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!uid) {
      setCargando(false);
      return;
    }
    return pedidosService.subscribeByUser(
      uid,
      (data) => {
        setPedidos(data);
        setCargando(false);
      },
      () => setCargando(false)
    );
  }, [uid]);

  return { pedidos, cargando };
}
