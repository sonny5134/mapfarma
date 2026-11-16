// components/SoloDesarrolladores.tsx
import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, FontSize, FontFamily, ThemeColors } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

// Aviso que se muestra si alguien sin rol Desarrollador llega a una pantalla de publicación.
export function SoloDesarrolladores() {
  const { colors: Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Ionicons name="lock-closed-outline" size={40} color={Colors.textMuted as string} />
      <Text style={styles.title}>Solo para desarrolladores</Text>
      <Text style={styles.text}>Tu cuenta es de Cliente: podés buscar medicamentos y hacer pedidos, pero no publicarlos.</Text>
    </View>
  );
}

const makeStyles = (Colors: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, backgroundColor: Colors.background },
    title: { marginTop: Spacing.md, fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.text },
    text: { marginTop: Spacing.sm, textAlign: 'center', fontSize: FontSize.md, fontFamily: FontFamily.regular, color: Colors.textMuted },
  });
