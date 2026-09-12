// app/medicamento/[id].tsx
import { View, Text, Pressable, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Colors, Spacing, FontSize, Radius, FontFamily } from '../../constants/theme';
import { useMedicamento } from '../../hooks/useMedicamento';
import { getFarmaciaById } from '../../contexts/CartContext';
import { useCart } from '../../contexts/CartContext';

export default function DetalleMedicamentoScreen() {
  // Buenas prácticas: solo viaja el ID por la ruta, el objeto completo se
  // recupera desde la fuente de datos (mockData hoy, Firebase en la Clase 5).
  const { id } = useLocalSearchParams<{ id: string }>();
  const { medicamento, cargando } = useMedicamento(id);
  const { linesResolved, addItem } = useCart();

  const enCarrito = linesResolved.find((l) => l.medicamentoId === id)?.cantidad ?? 0;

  if (cargando) {
    return (
      <>
        <Stack.Screen options={{ title: 'Cargando...' }} />
        <ActivityIndicator style={styles.loader} size="large" color={Colors.primary} />
      </>
    );
  }

  if (!medicamento) {
    return (
      <>
        <Stack.Screen options={{ title: 'No encontrado' }} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>No encontramos ese medicamento.</Text>
        </View>
      </>
    );
  }

  const farmacia = getFarmaciaById(medicamento.farmaciaId);
  const agotado = medicamento.stock === 0;

  return (
    <>
      {/* Header nativo dinámico: el título cambia según el producto */}
      <Stack.Screen
        options={{
          title: medicamento.nombre,
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imagePlaceholder}>
          {medicamento.requiereReceta && (
            <View style={styles.recetaBadge}>
              <Text style={styles.recetaBadgeText}>Requiere receta</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <Text style={styles.categoria}>{medicamento.categoria.toUpperCase()}</Text>

          <View style={styles.tituloRow}>
            <Text style={styles.nombre}>{medicamento.nombre}</Text>
            <Text style={styles.precio}>${medicamento.precio.toLocaleString('es-AR')}</Text>
          </View>

          <Text style={styles.descripcion}>{medicamento.descripcion}</Text>

          {/* Conditional rendering: stock disponible vs. agotado */}
          {agotado ? (
            <View style={styles.stockBadgeAgotado}>
              <Text style={styles.stockTextAgotado}>Sin stock</Text>
            </View>
          ) : (
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>Stock: {medicamento.stock} u.</Text>
            </View>
          )}

          {farmacia && (
            <View style={styles.farmaciaCard}>
              <Text style={styles.farmaciaLabel}>DISPONIBLE EN</Text>
              <Text style={styles.farmaciaNombre}>{farmacia.nombre}</Text>
              <Text style={styles.farmaciaDireccion}>
                {farmacia.direccion} · {farmacia.barrio}
              </Text>
              <Text style={styles.farmaciaRetiro}>Retiro presencial en local</Text>
            </View>
          )}

          {/* Conditional rendering: aviso de receta médica obligatoria */}
          {medicamento.requiereReceta && !agotado && (
            <View style={styles.recetaAviso}>
              <Text style={styles.recetaAvisoText}>
                Este medicamento <Text style={styles.bold}>requiere receta médica</Text>. Al
                agregarlo al carrito, se te pedirá adjuntar una foto para que el farmacéutico
                pueda validar tu pedido.
              </Text>
            </View>
          )}

          <Pressable
            style={[styles.addButton, agotado && styles.addButtonDisabled]}
            disabled={agotado}
            onPress={() => addItem(medicamento.id)}
          >
            <Text style={styles.addButtonText}>
              {agotado
                ? 'SIN STOCK'
                : `AGREGAR AL CARRITO${enCarrito > 0 ? ` (${enCarrito} en carrito)` : ''}`}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: Spacing.xxl },

  loader: { flex: 1, justifyContent: 'center', backgroundColor: Colors.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  notFoundText: { fontSize: FontSize.md, fontFamily: FontFamily.regular, color: Colors.textMuted },

  imagePlaceholder: {
    height: 220,
    backgroundColor: Colors.cardBg,
  },
  recetaBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.danger,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  recetaBadgeText: { color: Colors.white, fontSize: FontSize.xs, fontFamily: FontFamily.bold },

  body: { padding: Spacing.lg },
  categoria: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: Colors.secondary,
    letterSpacing: 0.5,
  },
  tituloRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: Spacing.xs,
  },
  nombre: { flex: 1, fontSize: FontSize.xxl, fontFamily: FontFamily.bold, color: Colors.primary, marginRight: Spacing.sm },
  precio: { fontSize: FontSize.xxl, fontFamily: FontFamily.bold, color: Colors.primary },

  descripcion: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.text,
    marginTop: Spacing.md,
    lineHeight: 20,
  },

  stockBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E7F9E7',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    marginTop: Spacing.md,
  },
  stockText: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.success },
  stockBadgeAgotado: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDECEC',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    marginTop: Spacing.md,
  },
  stockTextAgotado: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.danger },

  farmaciaCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },
  farmaciaLabel: { fontSize: FontSize.xs, fontFamily: FontFamily.bold, color: Colors.textMuted },
  farmaciaNombre: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.primary, marginTop: Spacing.xs },
  farmaciaDireccion: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },
  farmaciaRetiro: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.secondary, marginTop: 2 },

  recetaAviso: {
    backgroundColor: '#FDECEC',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },
  recetaAvisoText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.text, lineHeight: 19 },
  bold: { fontFamily: FontFamily.bold },

  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  addButtonDisabled: { backgroundColor: Colors.border },
  addButtonText: { color: Colors.white, fontSize: FontSize.md, fontFamily: FontFamily.bold, letterSpacing: 0.5 },
});
