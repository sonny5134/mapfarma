// hooks/useMedicamentos.ts
import { useEffect, useState } from 'react';
import { medicamentosService } from '../services/firestoreMedicamentos';
import { Medicamento } from '../types';

interface UseMedicamentosResult {
  medicamentos: Medicamento[];
  cargando: boolean;
  error: string | null;
}

// Pantalla -> useMedicamentos (este hook) -> medicamentosService -> backend.
// El hook no sabe qué base de datos hay detrás: para cambiar de backend alcanza con
// cambiar la importación de arriba por otro servicio que cumpla el contrato (ver services/contratos.ts).
export function useMedicamentos(): UseMedicamentosResult {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cancelar = medicamentosService.subscribeAll(
      (data) => {
        setMedicamentos(data);
        setCargando(false);
        setError(null);
      },
      (mensaje) => {
        setError(mensaje);
        setCargando(false);
      }
    );

    // cleanup: cancela la suscripción al desmontar (evita fugas de memoria)
    return cancelar;
  }, []);

  return { medicamentos, cargando, error };
}
