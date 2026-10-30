// services/pedidosService.ts
// Historial de pedidos en Firestore: colección "pedidos". Cada pedido guarda el userId de
// quien lo hizo; las Security Rules garantizan que cada persona solo ve los suyos.
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { Pedido } from '../types';

const COL = 'pedidos';

export type NuevoPedido = Omit<Pedido, 'id'>;

export const pedidosService = {
  create: async (pedido: NuevoPedido): Promise<string> => {
    const ref = await addDoc(collection(db, COL), pedido);
    return ref.id;
  },

  // TIEMPO REAL: los pedidos de un usuario, del más nuevo al más viejo.
  // Se ordena acá y no en la consulta, así no hace falta crear un índice en Firestore.
  subscribeByUser: (
    uid: string,
    onData: (pedidos: Pedido[]) => void,
    onError: (mensaje: string) => void
  ) => {
    const q = query(collection(db, COL), where('userId', '==', uid));
    return onSnapshot(
      q,
      (snap) => {
        const pedidos = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Pedido, 'id'>) }));
        pedidos.sort((a, b) => b.fecha.localeCompare(a.fecha));
        onData(pedidos);
      },
      (err) => onError(err.message)
    );
  },
};
