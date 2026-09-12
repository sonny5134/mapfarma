// app/checkout.tsx
import { useState } from 'react';
import { View, Text, Image, Pressable, FlatList, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, Radius, FontFamily } from '../constants/theme';
import { useCart, getFarmaciaById } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { MetodoPago } from '../types';

const metodosPago: { id: MetodoPago; label: string; emoji: string }[] = [
  { id: 'efectivo', label: 'Efectivo en farmacia', emoji: '💵' },
  { id: 'debito', label: 'Tarjeta de débito', emoji: '💳' },
  { id: 'credito', label: 'Tarjeta de crédito', emoji: '💳' },
];

export default function CheckoutScreen() {
  const { linesResolved, total, clearCart, recetaImagenUri } = useCart();
  const { registrarPedido } = useUser();
  const [metodoElegido, setMetodoElegido] = useState<MetodoPago>('efectivo');

  // Simplificación: asumimos que el pedido se retira en la farmacia de la primera línea.
  // TODO: si el carrito tiene productos de más de una farmacia, este flujo debería
  // separar el pedido en uno por farmacia. Por ahora, un solo punto de retiro.
  const farmaciaRetiro = linesResolved[0] ? getFarmaciaById(linesResolved[0].medicamento.farmaciaId) : undefined;

  const handleConfirmar = () => {
    registrarPedido();
    clearCart();
    Alert.alert('¡Pedido confirmado!', 'Podés retirarlo en la farmacia seleccionada.', [
      { text: 'OK', onPress: () => router.replace('/(tabs)') },
    ]);
  };

  if (linesResolved.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay productos para pagar.</Text>
        <Pressable style={styles.backButtonEmpty} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.backButtonEmptyText}>Volver a Inicio</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={metodosPago}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Checkout</Text>
            <Text style={styles.subtitle}>Confirmá tu pedido y elegí cómo pagar.</Text>

            <View style={styles.resumenCard}>
              <Text style={styles.resumenTitulo}>RESUMEN DEL PEDIDO</Text>
              {linesResolved.map((line) => (
                <View key={line.medicamentoId} style={styles.resumenRow}>
                  <View style={styles.resumenImagePlaceholder} />
                  <Text style={styles.resumenNombre} numberOfLines={1}>
                    {line.medicamento.nombre}
                  </Text>
                  <Text style={styles.resumenCantidad}>×{line.cantidad}</Text>
                  <Text style={styles.resumenPrecio}>
                    ${(line.medicamento.precio * line.cantidad).toLocaleString('es-AR')}
                  </Text>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toLocaleString('es-AR')}</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>PUNTO DE RETIRO</Text>
            <View style={styles.retiroCard}>
              <Text style={styles.retiroNombre}>{farmaciaRetiro?.nombre ?? 'Farmacia'}</Text>
              <Text style={styles.retiroDireccion}>
                {farmaciaRetiro?.direccion} · {farmaciaRetiro?.barrio}
              </Text>
            </View>

            {recetaImagenUri && (
              <View style={styles.recetaRow}>
                <Image source={{ uri: recetaImagenUri }} style={styles.recetaThumb} />
                <Text style={styles.recetaText}>Receta médica adjuntada ✓</Text>
              </View>
            )}

            <Text style={styles.sectionLabel}>MÉTODO DE PAGO</Text>
          </>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.metodoRow}
            onPress={() => setMetodoElegido(item.id)}
          >
            <Text style={styles.metodoEmoji}>{item.emoji}</Text>
            <Text style={styles.metodoLabel}>{item.label}</Text>
            <View style={[styles.radio, metodoElegido === item.id && styles.radioActivo]}>
              {metodoElegido === item.id && <View style={styles.radioDot} />}
            </View>
          </Pressable>
        )}
      />

      <Pressable style={styles.confirmarButton} onPress={handleConfirmar}>
        <Text style={styles.confirmarButtonText}>CONFIRMAR Y PAGAR</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  listContent: { padding: Spacing.lg },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  emptyText: { fontSize: FontSize.md, fontFamily: FontFamily.regular, color: Colors.textMuted, marginBottom: Spacing.md },
  backButtonEmpty: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.md },
  backButtonEmptyText: { color: Colors.white, fontFamily: FontFamily.bold },

  backLink: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.primary, marginBottom: Spacing.md },
  title: { fontSize: FontSize.xxxl, fontFamily: FontFamily.bold, color: Colors.primary },
  subtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: Spacing.xs, marginBottom: Spacing.lg },

  resumenCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  resumenTitulo: { fontSize: FontSize.xs, fontFamily: FontFamily.bold, color: Colors.textMuted, marginBottom: Spacing.sm },
  resumenRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  resumenImagePlaceholder: { width: 28, height: 28, borderRadius: Radius.sm, backgroundColor: Colors.cardBg, marginRight: Spacing.sm },
  resumenNombre: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.text },
  resumenCantidad: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, marginRight: Spacing.sm },
  resumenPrecio: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.text },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBg,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    marginTop: Spacing.xs,
  },
  totalLabel: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.primary },
  totalValue: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.primary },

  sectionLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.bold, color: Colors.textMuted, marginBottom: Spacing.sm },
  recetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F9E7',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  recetaThumb: { width: 32, height: 32, borderRadius: Radius.sm, marginRight: Spacing.sm },
  recetaText: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.success },
  retiroCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  retiroNombre: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.primary },
  retiroDireccion: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },

  metodoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  metodoEmoji: { fontSize: FontSize.lg, marginRight: Spacing.sm },
  metodoLabel: { flex: 1, fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.text },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActivo: { borderColor: Colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },

  confirmarButton: {
    backgroundColor: Colors.primary,
    margin: Spacing.lg,
    marginTop: 0,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  confirmarButtonText: { color: Colors.white, fontSize: FontSize.md, fontFamily: FontFamily.bold, letterSpacing: 0.5 },
});
