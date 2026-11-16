// utils/permisos.ts
import { Rol } from '../types';

// Solo el rol Desarrollador puede publicar, editar y administrar medicamentos (RF-015, RF-019).
// Clientes, y cualquier rol sin definir, solo consultan el catálogo y compran.
export const puedePublicar = (rol?: Rol | null): boolean => rol === 'Desarrollador';
