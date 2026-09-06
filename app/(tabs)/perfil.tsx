// app/(tabs)/perfil.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontFamily, Spacing } from '../../constants/theme';

// TODO: acá van los datos del usuario, "Mis productos" e "Historial de pedidos".
export default function PerfilScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.subtitle}>Mi cuenta</Text>
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
  },
});
