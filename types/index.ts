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
}

export interface CartItem {
  medicamentoId: string;
  farmaciaId: string;
  cantidad: number;
}

export type MetodoPago = 'efectivo' | 'debito' | 'credito';

export interface Pedido {
  id: string;
  items: CartItem[];
  total: number;
  farmaciaRetiroId: string;
  metodoPago: MetodoPago;
  fecha: string;
  requiereReceta: boolean;
  recetaImagenUrl?: string;
}

export type Rol = 'Desarrollador' | 'Diseñador' | 'Líder de proyecto';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  rol: Rol;
  miembroDesde: string;
  pedidosRealizados: number;
}
