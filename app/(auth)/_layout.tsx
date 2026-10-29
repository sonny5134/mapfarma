// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

export default function AuthLayout() {
  const { colors } = useTheme();
  // contentStyle evita un destello blanco entre Login y Registro en modo oscuro
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />;
}
