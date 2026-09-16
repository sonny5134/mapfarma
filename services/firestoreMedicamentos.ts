// services/firestoreMedicamentos.ts
import { db } from './firebase';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { Medicamento } from '../types';

const COL = 'medicamentos';

export const medicamentosService = {
  // LEER TODOS (fallback puntual; la Home usa onSnapshot en tiempo real, ver hooks/useMedicamentos.ts)
  getAll: async (): Promise<Medicamento[]> => {
    const snap = await getDocs(collection(db, COL));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Medicamento, 'id'>) }));
  },

  // LEER UNO POR ID (para la pantalla de Detalle)
  getById: async (id: string): Promise<Medicamento | null> => {
    const snap = await getDoc(doc(db, COL, id));
    return snap.exists() ? ({ id: snap.id, ...(snap.data() as Omit<Medicamento, 'id'>) }) : null;
  },
};
