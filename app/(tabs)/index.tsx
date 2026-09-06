// app/(tabs)/index.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontFamily, Spacing } from '../../constants/theme';

// TODO: acá va el switch Farmacias / Medicamentos con el mapa y la lista.
// Por ahora es un placeholder para poder navegar y probar los tabs.
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MapFarma</Text>
      <Text style={styles.subtitle}>Acá van Farmacias / Medicamentos</Text>
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
    fontSize: FontSize.xxxl,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
});
