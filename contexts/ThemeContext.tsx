// contexts/ThemeContext.tsx
// Modo claro / oscuro / automático (sigue al celular). La elección se recuerda al reabrir la app.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors, ThemeColors } from '../constants/theme';

export type ModoTema = 'claro' | 'oscuro' | 'auto';

interface ThemeContextValue {
  modo: ModoTema;
  isDark: boolean;
  colors: ThemeColors;
  setModo: (modo: ModoTema) => void;
}

const CLAVE = '@mapfarma/tema';

// Valor por defecto: tema claro. Así los componentes (y los tests) funcionan
// aunque no estén envueltos en un ThemeProvider.
const ThemeContext = createContext<ThemeContextValue>({
  modo: 'claro',
  isDark: false,
  colors: LightColors,
  setModo: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const esquemaSistema = useColorScheme(); // 'light' | 'dark' | null
  const [modo, setModoState] = useState<ModoTema>('auto');

  // Recupera la elección guardada. Si falla, queda en 'auto' (no es crítico).
  useEffect(() => {
    AsyncStorage.getItem(CLAVE)
      .then((guardado) => {
        if (guardado === 'claro' || guardado === 'oscuro' || guardado === 'auto') setModoState(guardado);
      })
      .catch(() => {});
  }, []);

  const setModo = useCallback((nuevo: ModoTema) => {
    setModoState(nuevo);
    AsyncStorage.setItem(CLAVE, nuevo).catch(() => {});
  }, []);

  const isDark = modo === 'oscuro' || (modo === 'auto' && esquemaSistema === 'dark');

  const value = useMemo<ThemeContextValue>(
    () => ({ modo, isDark, colors: isDark ? DarkColors : LightColors, setModo }),
    [modo, isDark, setModo]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
