// app/(tabs)/publicar.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontFamily, Spacing } from '../../constants/theme';

// TODO: acá va el formulario "Agregar medicamento" (foto, nombre, precio, stock, descripción).
export default function PublicarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar medicamento</Text>
      <Text style={styles.subtitle}>Publicá un producto en el catálogo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});
