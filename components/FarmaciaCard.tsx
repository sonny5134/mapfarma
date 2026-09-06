// components/FarmaciaCard.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, Radius, FontFamily } from '../constants/theme';
import { Farmacia } from '../types';

interface Props {
  farmacia: Farmacia;
}

export function FarmaciaCard({ farmacia }: Props) {
  return (
    <View style={styles.card}>
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
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
  badgeOn: { backgroundColor: '#E7F9E7' },
  badgeOff: { backgroundColor: '#F1F1F1' },
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
