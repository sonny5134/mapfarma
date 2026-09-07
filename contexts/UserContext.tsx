// contexts/UserContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { Usuario, Rol } from '../types';

interface UserContextValue {
  usuario: Usuario | null;
  login: (email: string) => void;
  registrar: (nombre: string, email: string, telefono: string) => void;
  logout: () => void;
  registrarPedido: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

const mesActual = new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

export function UserProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Demo: cualquier email/contraseña entra. Cuando haya backend, esto se reemplaza
  // por la respuesta real de la API con los datos guardados del usuario.
  const login = (email: string) => {
    setUsuario({
      id: 'demo-user',
      nombre: email.split('@')[0],
      email,
      rol: 'Desarrollador' as Rol,
      miembroDesde: mesActual,
      pedidosRealizados: 0,
    });
  };

  const registrar = (nombre: string, email: string, telefono: string) => {
    setUsuario({
      id: 'demo-user',
      nombre,
      email,
      telefono,
      rol: 'Desarrollador' as Rol,
      miembroDesde: mesActual,
      pedidosRealizados: 0,
    });
  };

  const logout = () => setUsuario(null);

  const registrarPedido = () => {
    setUsuario((prev) => (prev ? { ...prev, pedidosRealizados: prev.pedidosRealizados + 1 } : prev));
  };

  return (
    <UserContext.Provider value={{ usuario, login, registrar, logout, registrarPedido }}>
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
