// components/SkeletonList.tsx — Cajas grises que evitan saltos visuales (layout shift) mientras carga
import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Spacing, Radius, ThemeColors } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  cantidad?: number;
  alto?: number;
}

export function SkeletonList({ cantidad = 5, alto = 76 }: Props) {
  const { colors: Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View style={styles.container}>
      {Array.from({ length: cantidad }).map((_, i) => (
        <View
          key={i}
          style={[styles.skeleton, { height: alto, opacity: 0.9 - i * 0.08 }]}
        />
      ))}
    </View>
  );
}

const makeStyles = (Colors: ThemeColors) => StyleSheet.create({
  container: { padding: Spacing.lg },
  skeleton: {
    backgroundColor: Colors.border,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
  },
});
