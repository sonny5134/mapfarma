// types/index.ts
// Tipos compartidos de MapFarma

export interface Farmacia {
  id: string;
  nombre: string;
  direccion: string;
  barrio: string;
  telefono: string;
  latitud: number;
  longitud: number;
  distanciaMetros: number;
  enTurno: boolean;
  horaCierreTurno?: string; // ej: "28h 10m" restantes, o timestamp según cómo lo calculen
  rating: number;
}

export type CategoriaMedicamento =
  | 'Analgésicos'
  | 'Antibióticos'
  | 'Antialérgicos'
  | 'Gastro'
  | 'Otros';

export interface Medicamento {
  id: string;
  nombre: string;
  categoria: CategoriaMedicamento;
  precio: number;
  stock: number;
  descripcion: string;
  requiereReceta: boolean;
  imagenUrl?: string;
  farmaciaId: string; // a qué farmacia pertenece este stock
  userId?: string; // UID de Firebase de quien lo publicó (solo él puede editar/borrar)
}

export interface CartItem {
  medicamentoId: string;
  farmaciaId: string;
  cantidad: number;
}

export type MetodoPago = 'efectivo' | 'debito' | 'credito';

// Una línea del pedido. Se guarda una "foto" del nombre y el precio del momento de la compra:
// si el medicamento cambia de precio o se borra, el historial no se altera.
export interface PedidoItem {
  medicamentoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface Pedido {
  id: string;
  userId: string; // UID de Firebase de quien hizo el pedido
  items: PedidoItem[];
  total: number;
  farmaciaRetiroId: string;
  farmaciaNombre: string;
  metodoPago: MetodoPago;
  fecha: string; // ISO 8601, ej: "2026-10-29T22:15:00.000Z"
  requiereReceta: boolean;
}

// 'Cliente' es el rol por defecto de cualquier persona que se registra. Los demás roles
// (equipo del proyecto) solo se asignan a mano desde la consola de Firebase.
export type Rol = 'Cliente' | 'Desarrollador' | 'Diseñador' | 'Líder de proyecto';
export const ROLES_VALIDOS: Rol[] = ['Cliente', 'Desarrollador', 'Diseñador', 'Líder de proyecto'];

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  rol: Rol;
  miembroDesde: string;
  pedidosRealizados: number;
}
