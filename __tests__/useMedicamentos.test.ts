// __tests__/useMedicamentos.test.ts
import { renderHook, waitFor } from '@testing-library/react-native';

// 1. MOCK DE FIRESTORE: simulamos el backend, los tests NUNCA tocan la base real
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn((_q: unknown, onNext: (snap: unknown) => void) => {
    // Respuesta inmediata con 2 medicamentos falsos
    onNext({
      docs: [
        {
          id: '1',
          data: () => ({ nombre: 'Ibuprofeno 400mg', categoria: 'Analgésicos', precio: 1850, stock: 48 }),
        },
        {
          id: '2',
          data: () => ({ nombre: 'Loratadina 10mg', categoria: 'Antialérgicos', precio: 1290, stock: 0 }),
        },
      ],
    });
    return jest.fn(); // mock de la función de unsubscribe
  }),
}));

// 2. Mock de la inicialización de Firebase (no queremos credenciales ni red)
jest.mock('../services/firebase', () => ({ db: {} }));

import { onSnapshot } from 'firebase/firestore';
import { useMedicamentos } from '../hooks/useMedicamentos';

describe('useMedicamentos', () => {
  it('carga los medicamentos desde Firestore (mock) correctamente', async () => {
    const { result } = await renderHook(() => useMedicamentos());

    // Esperamos a que termine el estado de carga
    await waitFor(() => expect(result.current.cargando).toBe(false));

    // Verificamos los datos procesados (el id del documento se mezcla con sus campos)
    expect(result.current.medicamentos).toHaveLength(2);
    expect(result.current.medicamentos[0].id).toBe('1');
    expect(result.current.medicamentos[0].nombre).toBe('Ibuprofeno 400mg');
    expect(result.current.medicamentos[1].stock).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('expone el mensaje de error si Firestore falla', async () => {
    // Para este caso, la suscripción responde con un error en vez de datos
    (onSnapshot as jest.Mock).mockImplementationOnce(
      (_q: unknown, _onNext: unknown, onError: (e: { message: string }) => void) => {
        onError({ message: 'permission-denied' });
        return jest.fn();
      }
    );

    const { result } = await renderHook(() => useMedicamentos());

    await waitFor(() => expect(result.current.cargando).toBe(false));

    expect(result.current.error).toBe('permission-denied');
    expect(result.current.medicamentos).toHaveLength(0);
  });
});
