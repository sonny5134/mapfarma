// services/pedidosService.ts
// Historial de pedidos en Firestore: colección "pedidos". Cada pedido guarda el userId de
// quien lo hizo; las Security Rules garantizan que cada persona solo ve los suyos.
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { Pedido } from '../types';

const COL = 'pedidos';

export type NuevoPedido = Omit<Pedido, 'id'>;

// Sin internet, Firestore NO falla: deja la escritura en cola y addDoc no responde hasta
// recuperar la conexión. Por eso se pone un tiempo límite: pasado ese tiempo se avisa el error.
export const TIEMPO_LIMITE_PEDIDO_MS = 10000;
export const MENSAJE_SIN_CONEXION = 'Sin conexión. Revisá tu internet y volvé a intentar.';

export const pedidosService = {
  create: async (pedido: NuevoPedido): Promise<string> => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const limite = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(MENSAJE_SIN_CONEXION)), TIEMPO_LIMITE_PEDIDO_MS);
    });
    try {
      const ref = await Promise.race([addDoc(collection(db, COL), pedido), limite]);
      return ref.id;
    } finally {
      if (timer) clearTimeout(timer);
    }
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
