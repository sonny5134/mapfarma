// components/SelectorTema.tsx
// Botón de modo oscuro para el Perfil: Claro / Oscuro / Automático.
import { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors, Spacing, FontSize, Radius, FontFamily } from '../constants/theme';
import { ModoTema, useTheme } from '../contexts/ThemeContext';

const opciones: { modo: ModoTema; label: string; icono: keyof typeof Ionicons.glyphMap }[] = [
  { modo: 'claro', label: 'Claro', icono: 'sunny-outline' },
  { modo: 'oscuro', label: 'Oscuro', icono: 'moon-outline' },
  { modo: 'auto', label: 'Automático', icono: 'phone-portrait-outline' },
];

export function SelectorTema() {
  const { colors: Colors, modo, setModo } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.titulo}>APARIENCIA</Text>
      <View style={styles.fila} accessibilityRole="radiogroup">
        {opciones.map((o) => {
          const activa = modo === o.modo;
          return (
            <Pressable
              key={o.modo}
              style={[styles.opcion, activa && styles.opcionActiva]}
              onPress={() => setModo(o.modo)}
              accessibilityRole="radio"
              accessibilityState={{ checked: activa }}
              accessibilityLabel={`Tema ${o.label}`}
            >
              <Ionicons name={o.icono} size={18} color={activa ? Colors.white : Colors.textMuted} />
              <Text style={[styles.opcionTexto, activa && styles.opcionTextoActivo]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const makeStyles = (Colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md },
    titulo: {
      fontSize: FontSize.xs,
      fontFamily: FontFamily.bold,
      color: Colors.textMuted,
      letterSpacing: 0.5,
      marginBottom: Spacing.sm,
    },
    fila: {
      flexDirection: 'row',
      backgroundColor: Colors.surface,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.xs,
      gap: Spacing.xs,
    },
    opcion: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: Spacing.sm + 2,
      borderRadius: Radius.sm + 2,
    },
    opcionActiva: { backgroundColor: Colors.primary },
    opcionTexto: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.textMuted },
    opcionTextoActivo: { color: Colors.white },
  });
