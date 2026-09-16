// contexts/CartContext.tsx
import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Medicamento } from '../types';

export interface CartLine {
  medicamento: Medicamento;
  cantidad: number;
}

interface CartContextValue {
  lines: CartLine[];
  cartCount: number; // suma de cantidades, para el badge
  total: number;
  requiereReceta: boolean;
  recetaImagenUri: string | null;
  setRecetaImagen: (uri: string) => void;
  addItem: (medicamento: Medicamento) => void;
  incrementItem: (medicamentoId: string) => void;
  decrementItem: (medicamentoId: string) => void;
  removeItem: (medicamentoId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [recetaImagenUri, setRecetaImagenUri] = useState<string | null>(null);

  const setRecetaImagen = (uri: string) => setRecetaImagenUri(uri);

  // Ahora recibe el medicamento COMPLETO (ya lo tenemos a mano en la Home o el
  // Detalle, que lo trajeron de Firestore) en vez de solo el id + una búsqueda
  // posterior en un mock local que ya no existe.
  const addItem = (medicamento: Medicamento) => {
    setLines((prev) => {
      const existe = prev.find((l) => l.medicamento.id === medicamento.id);
      if (existe) {
        return prev.map((l) =>
          l.medicamento.id === medicamento.id ? { ...l, cantidad: l.cantidad + 1 } : l
        );
      }
      return [...prev, { medicamento, cantidad: 1 }];
    });
  };

  const incrementItem = (medicamentoId: string) => {
    setLines((prev) =>
      prev.map((l) => (l.medicamento.id === medicamentoId ? { ...l, cantidad: l.cantidad + 1 } : l))
    );
  };

  const decrementItem = (medicamentoId: string) => {
    setLines((prev) =>
      prev
        .map((l) => (l.medicamento.id === medicamentoId ? { ...l, cantidad: l.cantidad - 1 } : l))
        .filter((l) => l.cantidad > 0)
    );
  };

  const removeItem = (medicamentoId: string) => {
    setLines((prev) => prev.filter((l) => l.medicamento.id !== medicamentoId));
  };

  const clearCart = () => {
    setLines([]);
    setRecetaImagenUri(null);
  };

  const cartCount = lines.reduce((acc, l) => acc + l.cantidad, 0);
  const total = useMemo(
    () => lines.reduce((acc, l) => acc + l.medicamento.precio * l.cantidad, 0),
    [lines]
  );
  const requiereReceta = lines.some((l) => l.medicamento.requiereReceta);

  return (
    <CartContext.Provider
      value={{
        lines,
        cartCount,
        total,
        requiereReceta,
        recetaImagenUri,
        setRecetaImagen,
        addItem,
        incrementItem,
        decrementItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart tiene que usarse dentro de un <CartProvider>');
  }
  return context;
}
