// services/firestoreMedicamentos.ts
import { db } from './firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Medicamento } from '../types';
import { MedicamentoForm } from '../schemas/medicamentoSchema';

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

  // CREATE — usado desde la pantalla de Publicar
  create: async (data: MedicamentoForm & { imagenUrl?: string; publicadoPor?: string }) => {
    return await addDoc(collection(db, COL), data);
  },

  // UPDATE — usado desde la pantalla de Editar
  update: async (id: string, data: Partial<MedicamentoForm & { imagenUrl?: string }>) => {
    return await updateDoc(doc(db, COL, id), data);
  },

  // DELETE — usado desde el Detalle, con confirmación previa
  delete: async (id: string) => {
    return await deleteDoc(doc(db, COL, id));
  },
};
