// services/contratos.ts
// El "contrato" que cualquier backend (Firestore, una API REST, Supabase...) tiene que cumplir
// para que los hooks y la interfaz funcionen sin enterarse de qué tecnología hay detrás.
import { Medicamento, Farmacia } from '../types';

export type Unsubscribe = () => void;

export interface MedicamentosService {
  // Entrega la lista completa y, si el backend lo permite, la mantiene actualizada.
  subscribeAll(
    onData: (medicamentos: Medicamento[]) => void,
    onError: (mensaje: string) => void
  ): Unsubscribe;
  getById(id: string): Promise<Medicamento | null>;
}

export interface FarmaciasService {
  subscribeAll(
    onData: (farmacias: Farmacia[]) => void,
    onError: (mensaje: string) => void
  ): Unsubscribe;
  getById(id: string): Promise<Farmacia | null>;
}
