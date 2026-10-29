// components/ErrorView.tsx — Estado de error con reintento
import { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, FontSize, Radius, FontFamily, ThemeColors } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  mensaje: string;
  onRetry?: () => void;
}

export function ErrorView({ mensaje, onRetry }: Props) {
  const { colors: Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={40} color={Colors.danger} />
      <Text style={styles.msg}>{mensaje}</Text>
      {onRetry && (
        <Pressable style={styles.btn} onPress={onRetry}>
          <Text style={styles.btnText}>Reintentar</Text>
        </Pressable>
      )}
    </View>
  );
}

const makeStyles = (Colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg },
  msg: {
    color: Colors.danger,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  btnText: { color: Colors.white, fontFamily: FontFamily.bold, fontSize: FontSize.sm },
});
