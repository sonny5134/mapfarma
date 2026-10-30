// contexts/UserContext.tsx
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { Usuario, Rol, ROLES_VALIDOS } from '../types';
import { authService } from '../services/authService';
import { usuariosService, PerfilUsuario } from '../services/usuariosService';
import { tokenService } from '../services/tokenService';

interface DatosRegistro {
  nombre: string;
  email: string;
  telefono?: string;
  password: string;
}

interface UserContextValue {
  usuario: Usuario | null;
  ready: boolean; // false hasta que Firebase termina de restaurar la sesión al abrir la app
  login: (email: string, password: string) => Promise<void>;
  registrar: (datos: DatosRegistro) => Promise<void>;
  logout: () => Promise<void>;
  registrarPedido: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

const formatearMes = (fecha: Date) =>
  fecha.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

// Arma el Usuario de la app a partir del usuario de Firebase Auth + su perfil en Firestore
function construirUsuario(fbUser: User, perfil: PerfilUsuario | null): Usuario {
  const email = fbUser.email ?? '';
  return {
    id: fbUser.uid,
    nombre: perfil?.nombre || fbUser.displayName || email.split('@')[0],
    email,
    telefono: perfil?.telefono || undefined,
    rol: ROLES_VALIDOS.includes(perfil?.rol as Rol) ? (perfil!.rol as Rol) : 'Cliente',
    miembroDesde:
      perfil?.miembroDesde ||
      formatearMes(fbUser.metadata.creationTime ? new Date(fbUser.metadata.creationTime) : new Date()),
    pedidosRealizados: perfil?.pedidosRealizados ?? 0,
  };
}

// Guarda el token de sesión (JWT) cifrado con SecureStore (ver tokenService, Clase 7)
async function guardarToken(fbUser: User) {
  try {
    const token = await fbUser.getIdToken();
    await tokenService.save(token, fbUser.uid);
  } catch {
    // no es crítico: Firebase igual mantiene la sesión por su cuenta
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [ready, setReady] = useState(false);
  // Mientras se está registrando, ignoramos el listener para no pisar el perfil a medio crear
  const registrandoRef = useRef(false);

  // Listener global de Firebase: restaura la sesión al abrir la app y reacciona a login/logout
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (fbUser) => {
      if (registrandoRef.current) return;

      if (fbUser) {
        const perfil = await usuariosService.get(fbUser.uid).catch(() => null);
        setUsuario(construirUsuario(fbUser, perfil));
      } else {
        setUsuario(null);
      }
      setReady(true);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const fbUser = await authService.signIn(email, password);
    const perfil = await usuariosService.get(fbUser.uid).catch(() => null);
    await guardarToken(fbUser);
    setUsuario(construirUsuario(fbUser, perfil));
  };

  const registrar = async ({ nombre, email, telefono, password }: DatosRegistro) => {
    registrandoRef.current = true;
    try {
      const fbUser = await authService.signUp(email, password);
      await authService.updateName(fbUser, nombre);

      const perfil: PerfilUsuario = {
        nombre,
        telefono: telefono ?? '',
        miembroDesde: formatearMes(new Date()),
        pedidosRealizados: 0,
        rol: 'Cliente', // nadie se registra con otro rol (lo exigen las Security Rules)
      };
      await usuariosService.create(fbUser.uid, perfil).catch(() => {});
      await guardarToken(fbUser);
      setUsuario(construirUsuario(fbUser, perfil));
    } finally {
      registrandoRef.current = false;
    }
  };

  const logout = async () => {
    await tokenService.clear().catch(() => {});
    await authService.logout();
    setUsuario(null);
  };

  const registrarPedido = async () => {
    if (!usuario) return;
    await usuariosService.sumarPedido(usuario.id).catch(() => {});
    setUsuario((prev) => (prev ? { ...prev, pedidosRealizados: prev.pedidosRealizados + 1 } : prev));
  };

  return (
    <UserContext.Provider value={{ usuario, ready, login, registrar, logout, registrarPedido }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser tiene que usarse dentro de un <UserProvider>');
  }
  return context;
}
