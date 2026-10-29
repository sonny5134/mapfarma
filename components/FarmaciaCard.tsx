// components/FarmaciaCard.tsx
import { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, FontSize, Radius, FontFamily, ThemeColors } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { Farmacia } from '../types';

interface Props {
  farmacia: Farmacia;
}

function FarmaciaCardBase({ farmacia }: Props) {
  const { colors: Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  return (
    <View
      style={styles.card}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${farmacia.nombre}, ${farmacia.enTurno ? 'en turno' : 'sin turno'}, a ${
        farmacia.distanciaMetros
      } metros, calificación ${farmacia.rating}, teléfono ${farmacia.telefono}`}
    >
      <View style={styles.topRow}>
        <View style={[styles.badge, farmacia.enTurno ? styles.badgeOn : styles.badgeOff]}>
          <View style={[styles.dot, { backgroundColor: farmacia.enTurno ? Colors.success : Colors.textMuted }]} />
          <Text style={[styles.badgeText, { color: farmacia.enTurno ? Colors.success : Colors.textMuted }]}>
            {farmacia.enTurno ? 'EN TURNO' : 'SIN TURNO'}
          </Text>
        </View>
        <Text style={styles.distancia}>{farmacia.distanciaMetros} m</Text>
      </View>

      <View style={styles.middleRow}>
        <Text style={styles.nombre}>{farmacia.nombre}</Text>
        <Text style={styles.rating}>★ {farmacia.rating}</Text>
      </View>

      <Text style={styles.direccion}>{farmacia.direccion} · {farmacia.barrio}</Text>
      <Text style={styles.telefono}>{farmacia.telefono}</Text>
    </View>
  );
}

// memo(): la tarjeta solo se redibuja si cambia la farmacia (o su distancia).
export const FarmaciaCard = memo(FarmaciaCardBase);

const makeStyles = (Colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  badgeOn: { backgroundColor: Colors.successBg },
  badgeOff: { backgroundColor: Colors.neutralBg },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  badgeText: { fontSize: FontSize.xs, fontFamily: FontFamily.bold },
  distancia: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.secondary },

  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  nombre: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.primary },
  rating: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted },

  direccion: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },
  telefono: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.secondary, marginTop: 2 },
});
