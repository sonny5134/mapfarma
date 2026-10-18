// components/MedicamentoCard.tsx
import { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Radius, FontFamily } from '../constants/theme';
import { Medicamento } from '../types';

interface Props {
  medicamento: Medicamento;
  onAgregar?: (medicamento: Medicamento) => void;
  onPress?: (medicamento: Medicamento) => void;
}

// Base del componente. Más abajo se exporta envuelto en memo().
function MedicamentoCardBase({ medicamento, onAgregar, onPress }: Props) {
  const agotado = medicamento.stock === 0;

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress?.(medicamento)}
      accessibilityRole="button"
      accessibilityLabel={`${medicamento.nombre}, ${medicamento.categoria}, ${
        agotado ? 'sin stock' : `$${medicamento.precio}`
      }${medicamento.requiereReceta ? ', requiere receta' : ''}`}
      accessibilityHint="Abre el detalle del medicamento"
      // Con lectores de pantalla, el botón "+" queda agrupado dentro de la tarjeta;
      // esta acción personalizada lo deja alcanzable igual.
      accessibilityActions={agotado ? undefined : [{ name: 'agregar', label: 'Agregar al carrito' }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === 'agregar') onAgregar?.(medicamento);
      }}
    >
      <View style={styles.imagePlaceholder}>
        {medicamento.requiereReceta && (
          <View style={styles.recetaBadge}>
            <Text style={styles.recetaBadgeText}>Receta</Text>
          </View>
        )}
        {/* Conditional rendering: solo se muestra cuando no hay stock */}
        {agotado && (
          <View style={styles.agotadoOverlay}>
            <Text style={styles.agotadoOverlayText}>Sin stock</Text>
          </View>
        )}
      </View>

      <Text style={styles.nombre} numberOfLines={1}>{medicamento.nombre}</Text>
      <Text style={styles.categoria}>{medicamento.categoria}</Text>

      {/* Conditional rendering: precio normal vs. aviso de agotado */}
      {agotado ? (
        <Text style={styles.agotadoLabel}>Agotado</Text>
      ) : (
        <View style={styles.bottomRow}>
          <Text style={styles.precio}>${medicamento.precio.toLocaleString('es-AR')}</Text>
          <Pressable
            style={styles.addButton}
            onPress={() => onAgregar?.(medicamento)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Agregar ${medicamento.nombre} al carrito`}
          >
            <Ionicons name="add" size={18} color={Colors.white} />
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

// React.memo compara las props de forma superficial: si `medicamento`, `onAgregar`
// y `onPress` mantienen la misma referencia, la tarjeta NO se vuelve a dibujar
// (por ejemplo, al tipear en el buscador de la Home).
export const MedicamentoCard = memo(MedicamentoCardBase);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    margin: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imagePlaceholder: {
    height: 90,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
    justifyContent: 'flex-start',
  },
  recetaBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: Colors.danger,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  recetaBadgeText: { color: Colors.white, fontSize: 9, fontFamily: FontFamily.bold },

  agotadoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
  },
  agotadoOverlayText: {
    color: Colors.danger,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    textTransform: 'uppercase',
  },
  agotadoLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: Colors.danger,
    marginTop: Spacing.sm,
  },

  nombre: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.primary },
  categoria: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  precio: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.primary },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
