// __tests__/CartContext.test.tsx — Caso: CP-RF-020-02
import { renderHook, act } from '@testing-library/react-native';
import { CartProvider, useCart } from '../contexts/CartContext';
import { Medicamento } from '../types';

const med = (id: string, precio: number, requiereReceta = false): Medicamento => ({
  id, nombre: `Med ${id}`, categoria: 'Otros', precio, stock: 10,
  descripcion: '', requiereReceta, farmaciaId: 'f1',
});

const wrapper = ({ children }: { children: React.ReactNode }) => <CartProvider>{children}</CartProvider>;

describe('CartContext', () => {
  it('el total suma precio × cantidad de todas las líneas (CP-RF-020-02)', async () => {
    const { result } = await renderHook(() => useCart(), { wrapper });
    await act(async () => {
      result.current.addItem(med('a', 1000));
      result.current.addItem(med('a', 1000));
      result.current.addItem(med('b', 250));
    });
    expect(result.current.cartCount).toBe(3);
    expect(result.current.total).toBe(2250);
  });

  it('decrementar hasta 0 quita la línea y recalcula el total', async () => {
    const { result } = await renderHook(() => useCart(), { wrapper });
    await act(async () => { result.current.addItem(med('a', 500)); });
    await act(async () => { result.current.decrementItem('a'); });
    expect(result.current.lines).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  it('al eliminar el medicamento con receta se descarta la foto y se vuelve a pedir al re-agregarlo', async () => {
    const { result } = await renderHook(() => useCart(), { wrapper });
    await act(async () => { result.current.addItem(med('r', 3200, true)); });
    await act(async () => { result.current.setRecetaImagen('file:///receta.jpg'); });
    expect(result.current.recetaImagenUri).toBe('file:///receta.jpg');

    await act(async () => { result.current.removeItem('r'); });
    expect(result.current.recetaImagenUri).toBeNull();

    await act(async () => { result.current.addItem(med('r', 3200, true)); });
    expect(result.current.requiereReceta).toBe(true);
    expect(result.current.recetaImagenUri).toBeNull();
  });

  it('conserva la receta mientras siga habiendo un medicamento que la exige', async () => {
    const { result } = await renderHook(() => useCart(), { wrapper });
    await act(async () => {
      result.current.addItem(med('r', 3200, true));
      result.current.addItem(med('n', 500, false));
    });
    await act(async () => { result.current.setRecetaImagen('file:///receta.jpg'); });
    await act(async () => { result.current.removeItem('n'); });
    expect(result.current.recetaImagenUri).toBe('file:///receta.jpg');
  });
});
