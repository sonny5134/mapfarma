// app/(tabs)/index.tsx
import { useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, Radius, FontFamily } from '../../constants/theme';
import { useFarmacias } from '../../hooks/useFarmacias';
import { useMedicamentos } from '../../hooks/useMedicamentos';
import { CategoriaMedicamento, Medicamento } from '../../types';
import { FarmaciaCard } from '../../components/FarmaciaCard';
import { MedicamentoCard } from '../../components/MedicamentoCard';
import { useCart } from '../../contexts/CartContext';
import { useUser } from '../../contexts/UserContext';

type SubTab = 'farmacias' | 'medicamentos';
const categorias: (CategoriaMedicamento | 'Todos')[] = [
  'Todos',
  'Analgésicos',
  'Antibióticos',
  'Antialérgicos',
  'Gastro',
];

export default function HomeScreen() {
  const [subTab, setSubTab] = useState<SubTab>('farmacias');
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<(typeof categorias)[number]>('Todos');

  const router = useRouter();
  const { cartCount, addItem } = useCart();
  const { usuario } = useUser();
  const { farmacias, cargando: cargandoFarmacias, refrescar: refrescarFarmacias } = useFarmacias();
  const { medicamentos, cargando: cargandoMedicamentos, refrescar: refrescarMedicamentos } = useMedicamentos();
  const enTurnoCount = farmacias.filter((f) => f.enTurno).length;

  const medicamentosFiltrados = useMemo(() => {
    return medicamentos.filter((m) => {
      const coincideCategoria = categoriaActiva === 'Todos' || m.categoria === categoriaActiva;
      const coincideBusqueda = m.nombre.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
  }, [busqueda, categoriaActiva, medicamentos]);

  const handleAgregarAlCarrito = (medicamento: Medicamento) => {
    addItem(medicamento.id);
  };

  const handleVerDetalle = (medicamento: Medicamento) => {
    router.push(`/medicamento/${medicamento.id}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <Ionicons name="heart" size={18} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.appName}>MapFarma</Text>
            {/* Estado global: el nombre viene del UserContext, se muestra acá y también en Perfil */}
            <Text style={styles.greeting}>
              {usuario ? `Hola, ${usuario.nombre} 👋` : 'Bienvenido'}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={12} color={Colors.textMuted} />
              <Text style={styles.locationText}>Pilar, Buenos Aires</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.cartButton}>
          <Ionicons name="bag-outline" size={22} color={Colors.primary} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Sub-tabs Farmacias / Medicamentos */}
      <View style={styles.subTabRow}>
        <Pressable
          style={styles.subTabButton}
          onPress={() => setSubTab('farmacias')}
        >
          <Text style={[styles.subTabText, subTab === 'farmacias' && styles.subTabTextActive]}>
            Farmacias
          </Text>
          {subTab === 'farmacias' && <View style={styles.subTabIndicator} />}
        </Pressable>
        <Pressable
          style={styles.subTabButton}
          onPress={() => setSubTab('medicamentos')}
        >
          <Text style={[styles.subTabText, subTab === 'medicamentos' && styles.subTabTextActive]}>
            Medicamentos
          </Text>
          {subTab === 'medicamentos' && <View style={styles.subTabIndicator} />}
        </Pressable>
      </View>

      {subTab === 'farmacias' ? (
        cargandoFarmacias ? (
          <ActivityIndicator style={styles.loader} size="large" color={Colors.primary} />
        ) : (
          <FlatList
            key="farmacias-list"
            data={farmacias}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            onRefresh={refrescarFarmacias}
            refreshing={cargandoFarmacias}
            ListHeaderComponent={
              <>
                {/* Mapa estilizado (placeholder visual, sin GPS real todavía) */}
                <View style={styles.mapPlaceholder}>
                  <Ionicons name="map-outline" size={28} color={Colors.textMuted} />
                  <Text style={styles.mapPlaceholderText}>Mapa de farmacias (próximamente con GPS real)</Text>
                </View>

                <View style={styles.turnoRow}>
                  <View style={styles.turnoDot} />
                  <Text style={styles.turnoText}>
                    {enTurnoCount} de {farmacias.length} en turno
                  </Text>
                </View>
              </>
            }
            ListEmptyComponent={
              <Text style={styles.vacioText}>No hay farmacias disponibles en este momento.</Text>
            }
            renderItem={({ item }) => <FarmaciaCard farmacia={item} />}
          />
        )
      ) : cargandoMedicamentos ? (
        <ActivityIndicator style={styles.loader} size="large" color={Colors.primary} />
      ) : (
        <FlatList
          key="medicamentos-list"
          data={medicamentosFiltrados}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          onRefresh={refrescarMedicamentos}
          refreshing={cargandoMedicamentos}
          ListHeaderComponent={
            <>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color={Colors.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar medicamento..."
                  placeholderTextColor={Colors.textMuted}
                  value={busqueda}
                  onChangeText={setBusqueda}
                />
              </View>

              <FlatList
                data={categorias}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryList}
                renderItem={({ item }) => (
                  <Pressable
                    style={[styles.categoryPill, categoriaActiva === item && styles.categoryPillActive]}
                    onPress={() => setCategoriaActiva(item)}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        categoriaActiva === item && styles.categoryPillTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                )}
              />
            </>
          }
          ListEmptyComponent={
            <Text style={styles.vacioText}>No encontramos medicamentos con ese filtro.</Text>
          }
          renderItem={({ item }) => (
            <MedicamentoCard medicamento={item} onAgregar={handleAgregarAlCarrito} onPress={handleVerDetalle} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  appName: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.primary },
  greeting: { fontSize: FontSize.xs, fontFamily: FontFamily.bold, color: Colors.secondary, marginTop: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  locationText: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginLeft: 2 },

  cartButton: { padding: Spacing.xs },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.secondary,
    borderRadius: Radius.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: { color: Colors.white, fontSize: 9, fontFamily: FontFamily.bold },

  subTabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.lg,
  },
  subTabButton: { marginRight: Spacing.lg, paddingBottom: Spacing.sm },
  subTabText: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.textMuted },
  subTabTextActive: { color: Colors.secondary },
  subTabIndicator: {
    height: 2,
    backgroundColor: Colors.secondary,
    marginTop: Spacing.xs,
    borderRadius: 1,
  },

  listContent: { padding: Spacing.lg },
  loader: { flex: 1, justifyContent: 'center' },
  vacioText: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    marginTop: Spacing.xl,
  },

  mapPlaceholder: {
    height: 160,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  mapPlaceholderText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },

  turnoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  turnoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: Spacing.xs,
  },
  turnoText: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.text },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    marginLeft: Spacing.sm,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.text,
  },

  categoryList: { marginBottom: Spacing.md },
  categoryPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  categoryPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryPillText: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.textMuted },
  categoryPillTextActive: { color: Colors.white },
});
