// services/authService.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

// Nunca llamamos a Firebase directamente desde los botones: todo pasa por este servicio.
export const authService = {
  // Ingreso de usuarios existentes
  signIn: async (email: string, pass: string): Promise<User> => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return cred.user;
  },

  // Registro de nuevos usuarios
  signUp: async (email: string, pass: string): Promise<User> => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    return cred.user;
  },

  // Guardar el nombre visible en el perfil de Firebase Auth
  updateName: async (user: User, nombre: string) => {
    await updateProfile(user, { displayName: nombre });
  },

  // Cerrar sesión
  logout: async () => {
    await signOut(auth);
  },

  // Listener global: avisa cada vez que cambia la sesión (login, logout, sesión restaurada)
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },
};

// Traduce los códigos de error de Firebase a mensajes claros en español
export function mensajeErrorAuth(err: any): string {
  switch (err?.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email o contraseña incorrectos.';
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con ese email.';
    case 'auth/weak-password':
      return 'La contraseña es demasiado débil.';
    case 'auth/invalid-email':
      return 'El email no es válido.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Probá de nuevo en unos minutos.';
    case 'auth/network-request-failed':
      return 'Sin conexión. Revisá tu internet.';
    default:
      return err?.message ?? 'Ocurrió un error inesperado.';
  }
}
