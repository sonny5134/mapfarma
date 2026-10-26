// services/firestoreMedicamentos.ts
import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { Medicamento } from '../types';
import { MedicamentoForm } from '../schemas/medicamentoSchema';
import { MedicamentosService, Unsubscribe } from './contratos';

const COL = 'medicamentos';

export const medicamentosService = {
  // TIEMPO REAL: toda la lista, ordenada por nombre. Devuelve la función para cancelar la suscripción.
  subscribeAll: (
    onData: (medicamentos: Medicamento[]) => void,
    onError: (mensaje: string) => void
  ): Unsubscribe => {
    const q = query(collection(db, COL), orderBy('nombre', 'asc'));
    return onSnapshot(
      q,
      (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Medicamento, 'id'>) }))),
      (err) => onError(err.message)
    );
  },

  // TIEMPO REAL: solo los medicamentos publicados por un usuario (para "Mis productos")
  subscribeByUser: (
    uid: string,
    onData: (medicamentos: Medicamento[]) => void,
    onError: (mensaje: string) => void
  ): Unsubscribe => {
    const q = query(collection(db, COL), where('userId', '==', uid));
    return onSnapshot(
      q,
      (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Medicamento, 'id'>) }))),
      (err) => onError(err.message)
    );
  },

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
  // Las Security Rules exigen que userId sea el UID de quien está logueado.
  create: async (
    data: MedicamentoForm & { farmaciaId: string; userId: string; imagenUrl?: string }
  ) => {
    // Firestore rechaza los campos con valor undefined, así que los sacamos
    const limpio = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
    return await addDoc(collection(db, COL), limpio);
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

// Verificación en tiempo de compilación: si este servicio deja de cumplir el contrato, TypeScript avisa.
const _cumpleElContrato: MedicamentosService = medicamentosService;
void _cumpleElContrato;
