// services/firestoreFarmacias.ts
import { db } from './firebase';
import { collection, doc, getDocs, getDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Farmacia } from '../types';
import { FarmaciasService, Unsubscribe } from './contratos';

const COL = 'farmacias';

export const farmaciasService = {
  // TIEMPO REAL: todas las farmacias ordenadas por nombre
  subscribeAll: (
    onData: (farmacias: Farmacia[]) => void,
    onError: (mensaje: string) => void
  ): Unsubscribe => {
    const q = query(collection(db, COL), orderBy('nombre', 'asc'));
    return onSnapshot(
      q,
      (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Farmacia, 'id'>) }))),
      (err) => onError(err.message)
    );
  },

  getAll: async (): Promise<Farmacia[]> => {
    const snap = await getDocs(collection(db, COL));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Farmacia, 'id'>) }));
  },

  getById: async (id: string): Promise<Farmacia | null> => {
    const snap = await getDoc(doc(db, COL, id));
    return snap.exists() ? ({ id: snap.id, ...(snap.data() as Omit<Farmacia, 'id'>) }) : null;
  },
};

// Verificación en tiempo de compilación del contrato
const _cumpleElContrato: FarmaciasService = farmaciasService;
void _cumpleElContrato;
