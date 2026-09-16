// services/firestoreFarmacias.ts
import { db } from './firebase';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { Farmacia } from '../types';

const COL = 'farmacias';

export const farmaciasService = {
  getAll: async (): Promise<Farmacia[]> => {
    const snap = await getDocs(collection(db, COL));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Farmacia, 'id'>) }));
  },

  getById: async (id: string): Promise<Farmacia | null> => {
    const snap = await getDoc(doc(db, COL, id));
    return snap.exists() ? ({ id: snap.id, ...(snap.data() as Omit<Farmacia, 'id'>) }) : null;
  },
};
