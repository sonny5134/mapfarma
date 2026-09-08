// contexts/CartContext.tsx
import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { medicamentos } from '../data/medicamentos';
import { farmacias } from '../data/farmacias';
import { Medicamento } from '../types';

interface CartLine {
  medicamentoId: string;
  cantidad: number;
}

// Lo que le devolvemos a la UI: la línea del carrito + el medicamento completo ya resuelto
export interface CartLineResolved extends CartLine {
  medicamento: Medicamento;
}

interface CartContextValue {
  lines: CartLine[];
  linesResolved: CartLineResolved[];
  cartCount: number; // suma de cantidades, para el badge
  total: number;
  requiereReceta: boolean;
  recetaImagenUri: string | null;
  setRecetaImagen: (uri: string) => void;
  addItem: (medicamentoId: string) => void;
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

  const addItem = (medicamentoId: string) => {
    setLines((prev) => {
      const existe = prev.find((l) => l.medicamentoId === medicamentoId);
      if (existe) {
        return prev.map((l) =>
          l.medicamentoId === medicamentoId ? { ...l, cantidad: l.cantidad + 1 } : l
        );
      }
      return [...prev, { medicamentoId, cantidad: 1 }];
    });
  };

  const incrementItem = (medicamentoId: string) => {
    setLines((prev) =>
      prev.map((l) => (l.medicamentoId === medicamentoId ? { ...l, cantidad: l.cantidad + 1 } : l))
    );
  };

  const decrementItem = (medicamentoId: string) => {
    setLines((prev) =>
      prev
        .map((l) => (l.medicamentoId === medicamentoId ? { ...l, cantidad: l.cantidad - 1 } : l))
        .filter((l) => l.cantidad > 0)
    );
  };

  const removeItem = (medicamentoId: string) => {
    setLines((prev) => prev.filter((l) => l.medicamentoId !== medicamentoId));
  };

  const clearCart = () => {
    setLines([]);
    setRecetaImagenUri(null);
  };

  const linesResolved: CartLineResolved[] = useMemo(
    () =>
      lines
        .map((l) => {
          const medicamento = medicamentos.find((m) => m.id === l.medicamentoId);
          return medicamento ? { ...l, medicamento } : null;
        })
        .filter((l): l is CartLineResolved => l !== null),
    [lines]
  );

  const cartCount = lines.reduce((acc, l) => acc + l.cantidad, 0);
  const total = linesResolved.reduce((acc, l) => acc + l.medicamento.precio * l.cantidad, 0);
  const requiereReceta = linesResolved.some((l) => l.medicamento.requiereReceta);

  return (
    <CartContext.Provider
      value={{
        lines,
        linesResolved,
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

// Útil para agrupar las líneas del carrito por farmacia en la UI (como en el mockup)
export function getFarmaciaById(id: string) {
  return farmacias.find((f) => f.id === id);
}
