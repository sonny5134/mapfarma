// app/(tabs)/carrito.tsx
import { useMemo } from 'react';
import { View, Text, Image, Pressable, FlatList, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Radius, FontFamily } from '../../constants/theme';
import { useCart, getFarmaciaById, CartLineResolved } from '../../contexts/CartContext';

interface Grupo {
  farmaciaId: string;
  lines: CartLineResolved[];
}

export default function CarritoScreen() {
  const { linesResolved, total, requiereReceta, incrementItem, decrementItem, removeItem } = useCart();

  // Agrupamos las líneas por farmacia, como en el mockup
  const grupos: Grupo[] = useMemo(() => {
    const mapa = new Map<string, CartLineResolved[]>();
    linesResolved.forEach((line) => {
      const key = line.medicamento.farmaciaId;
      if (!mapa.has(key)) mapa.set(key, []);
      mapa.get(key)!.push(line);
    });
    return Array.from(mapa.entries()).map(([farmaciaId, lines]) => ({ farmaciaId, lines }));
  }, [linesResolved]);

  const handleContinuar = () => {
    if (requiereReceta) {
      // TODO: acá va el flujo real de adjuntar foto de la receta (expo-image-picker)
      Alert.alert('Adjuntar receta', 'Esta parte todavía no está construida.');
      return;
    }
    router.push('/checkout');
  };

  if (linesResolved.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bag-outline" size={48} color={Colors.textMuted} />
        <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
        <Text style={styles.emptySubtitle}>Agregá medicamentos desde la pestaña Inicio.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>Mi carrito</Text>
        <Text style={styles.subtitle}>Retiro presencial en la farmacia seleccionada.</Text>
      </View>

      <FlatList
        data={grupos}
        keyExtractor={(g) => g.farmaciaId}
        contentContainerStyle={styles.listContent}
        renderItem={({ item: grupo }) => {
          const farmacia = getFarmaciaById(grupo.farmaciaId);
          return (
            <View style={styles.grupo}>
              <View style={styles.grupoHeader}>
                <View style={styles.grupoIcon}>
                  <Ionicons name="add" size={14} color={Colors.white} />
                </View>
                <View>
                  <Text style={styles.grupoNombre}>{farmacia?.nombre ?? 'Farmacia'}</Text>
                  <Text style={styles.grupoDireccion}>{farmacia?.direccion}</Text>
                </View>
              </View>

              {grupo.lines.map((line) => (
                <View key={line.medicamentoId} style={styles.itemRow}>
                  <View style={styles.itemImagePlaceholder} />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemNombre} numberOfLines={1}>
                      {line.medicamento.nombre}
                    </Text>
                    <Text style={styles.itemPrecio}>
                      ${(line.medicamento.precio * line.cantidad).toLocaleString('es-AR')}
                    </Text>
                  </View>

                  <View style={styles.stepper}>
                    <Pressable
                      style={styles.stepperButton}
                      onPress={() => decrementItem(line.medicamentoId)}
                    >
                      <Ionicons name="remove" size={16} color={Colors.white} />
                    </Pressable>
                    <Text style={styles.stepperCantidad}>{line.cantidad}</Text>
                    <Pressable
                      style={styles.stepperButton}
                      onPress={() => incrementItem(line.medicamentoId)}
                    >
                      <Ionicons name="add" size={16} color={Colors.white} />
                    </Pressable>
                  </View>

                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removeItem(line.medicamentoId)}
                    hitSlop={8}
                  >
                    <Ionicons name="close" size={16} color={Colors.danger} />
                  </Pressable>
                </View>
              ))}
            </View>
          );
        }}
        ListFooterComponent={
          <View style={styles.resumen}>
            <Text style={styles.resumenTitulo}>RESUMEN</Text>
            {linesResolved.map((line) => (
              <View key={line.medicamentoId} style={styles.resumenRow}>
                <Text style={styles.resumenItem}>
                  {line.medicamento.nombre} × {line.cantidad}
                </Text>
                <Text style={styles.resumenItem}>
                  ${(line.medicamento.precio * line.cantidad).toLocaleString('es-AR')}
                </Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.resumenRow}>
              <Text style={styles.totalLabel}>Total estimado</Text>
              <Text style={styles.totalValue}>${total.toLocaleString('es-AR')}</Text>
            </View>
            <View style={styles.resumenRow}>
              <Text style={styles.envioLabel}>Envío</Text>
              <Text style={styles.envioValue}>Gratis · retiro en farmacia</Text>
            </View>
          </View>
        }
      />

      <Pressable style={styles.continuarButton} onPress={handleContinuar}>
        <Ionicons
          name={requiereReceta ? 'document-text-outline' : 'checkmark-circle-outline'}
          size={18}
          color={Colors.primary}
        />
        <Text style={styles.continuarText}>
          {requiereReceta ? 'ADJUNTÁ LA RECETA PARA CONTINUAR' : 'CONTINUAR'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  emptyTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.primary, marginTop: Spacing.md },
  emptySubtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: Spacing.xs, textAlign: 'center' },

  headerBlock: { padding: Spacing.lg, paddingBottom: Spacing.sm },
  title: { fontSize: FontSize.xxxl, fontFamily: FontFamily.bold, color: Colors.primary },
  subtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: Spacing.xs },

  listContent: { paddingHorizontal: Spacing.lg },

  grupo: { marginBottom: Spacing.md },
  grupoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  grupoIcon: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  grupoNombre: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.primary },
  grupoDireccion: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted },

  itemRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.md,
    padding: Spacing.sm, marginBottom: Spacing.xs,
    borderWidth: 1, borderColor: Colors.border,
  },
  itemImagePlaceholder: {
    width: 40, height: 40, borderRadius: Radius.sm,
    backgroundColor: Colors.cardBg, marginRight: Spacing.sm,
  },
  itemInfo: { flex: 1 },
  itemNombre: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.primary },
  itemPrecio: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },

  stepper: { flexDirection: 'row', alignItems: 'center', marginRight: Spacing.sm },
  stepperButton: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center',
  },
  stepperCantidad: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.text, marginHorizontal: Spacing.sm },

  removeButton: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#FDECEC', alignItems: 'center', justifyContent: 'center',
  },

  resumen: {
    backgroundColor: Colors.white, borderRadius: Radius.md,
    padding: Spacing.md, marginTop: Spacing.sm, marginBottom: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  resumenTitulo: { fontSize: FontSize.xs, fontFamily: FontFamily.bold, color: Colors.textMuted, marginBottom: Spacing.sm },
  resumenRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  resumenItem: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  totalLabel: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.primary },
  totalValue: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.primary },
  envioLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted },
  envioValue: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.success },

  continuarButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.cardBg,
    paddingVertical: Spacing.md,
    margin: Spacing.lg, marginTop: 0,
    borderRadius: Radius.md,
  },
  continuarText: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.primary, marginLeft: Spacing.xs },
});
