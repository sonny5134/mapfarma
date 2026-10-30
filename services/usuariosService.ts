// services/usuariosService.ts
// Firebase Auth solo guarda email, contraseña y nombre visible. El resto del perfil
// (teléfono, fecha de alta, pedidos realizados) vive en Firestore: usuarios/{uid}
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';
import { Rol } from '../types';

const COL = 'usuarios';

export interface PerfilUsuario {
  nombre: string;
  telefono: string;
  miembroDesde: string;
  pedidosRealizados: number;
  // Rol del usuario. Al registrarse siempre es 'Cliente': las Security Rules impiden que
  // alguien se asigne otro rol; el equipo se promueve a mano desde la consola de Firebase.
  rol?: Rol;
}

export const usuariosService = {
  create: async (uid: string, perfil: PerfilUsuario) => {
    await setDoc(doc(db, COL, uid), perfil);
  },

  get: async (uid: string): Promise<PerfilUsuario | null> => {
    const snap = await getDoc(doc(db, COL, uid));
    return snap.exists() ? (snap.data() as PerfilUsuario) : null;
  },

  sumarPedido: async (uid: string) => {
    await updateDoc(doc(db, COL, uid), { pedidosRealizados: increment(1) });
  },
};
