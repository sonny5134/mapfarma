// __tests__/pedidosService.test.ts — Sin conexión: el pedido no queda "confirmando" para siempre
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));
jest.mock('../services/firebase', () => ({ db: {} }));

import { addDoc } from 'firebase/firestore';
import { pedidosService, MENSAJE_SIN_CONEXION, TIEMPO_LIMITE_PEDIDO_MS } from '../services/pedidosService';

const pedido = {
  userId: 'u1', items: [], total: 0, farmaciaRetiroId: 'f1', farmaciaNombre: 'F',
  metodoPago: 'efectivo' as const, fecha: new Date().toISOString(), requiereReceta: false,
};

describe('pedidosService.create', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('devuelve el id cuando Firestore responde', async () => {
    (addDoc as jest.Mock).mockResolvedValueOnce({ id: 'p1' });
    await expect(pedidosService.create(pedido)).resolves.toBe('p1');
  });

  it('sin conexión (addDoc no responde) rechaza con mensaje claro al vencer el tiempo límite', async () => {
    (addDoc as jest.Mock).mockReturnValueOnce(new Promise(() => {}));
    const promesa = pedidosService.create(pedido);
    const resultado = expect(promesa).rejects.toThrow(MENSAJE_SIN_CONEXION);
    jest.advanceTimersByTime(TIEMPO_LIMITE_PEDIDO_MS);
    await resultado;
  });
});
