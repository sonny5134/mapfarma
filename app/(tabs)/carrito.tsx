// app/(tabs)/carrito.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontFamily, Spacing } from '../../constants/theme';

// TODO: acá va la lista de productos en el carrito, agrupados por farmacia, + resumen y checkout.
export default function CarritoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi carrito</Text>
      <Text style={styles.subtitle}>Retiro presencial en la farmacia seleccionada.</Text>
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
