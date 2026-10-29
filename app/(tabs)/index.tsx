// app/(tabs)/index.tsx
import { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Spacing, FontSize, Radius, FontFamily, ThemeColors } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { Logo } from '../../components/Logo';
import { useFarmacias } from '../../hooks/useFarmacias';
import { useMedicamentos } from '../../hooks/useMedicamentos';
import { CategoriaMedicamento, Farmacia, Medicamento } from '../../types';
import { FarmaciaCard } from '../../components/FarmaciaCard';
import { MedicamentoCard } from '../../components/MedicamentoCard';
import { MapaFarmacias } from '../../components/MapaFarmacias';
import { SkeletonList } from '../../components/SkeletonList';
import { ErrorView } from '../../components/ErrorView';
import { useCart } from '../../contexts/CartContext';
import { useUser } from '../../contexts/UserContext';
import { usePermission } from '../../hooks/usePermission';
import { useLocation } from '../../hooks/useLocation';
import { calcularDistanciaMetros } from '../../utils/distancia';
import * as Location from 'expo-location';

type SubTab = 'farmacias' | 'medicamentos';
const categorias: (CategoriaMedicamento | 'Todos')[] = [
  'Todos',
  'Analgésicos',
  'Antibióticos',
  'Antialérgicos',
  'Gastro',
];

export default function HomeScreen() {
  const { colors: Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const [subTab, setSubTab] = useState<SubTab>('farmacias');
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<(typeof categorias)[number]>('Todos');

  const { cartCount, addItem } = useCart();
  const { usuario } = useUser();
  // Ambos hooks usan onSnapshot: la lista se actualiza sola si alguien edita
  // un documento desde la consola de Firebase, sin pull-to-refresh manual.
  const { farmacias, cargando: cargandoFarmacias, error: errorFarmacias } = useFarmacias();
  const { medicamentos, cargando: cargandoMedicamentos, error: errorMedicamentos } = useMedicamentos();
  const enTurnoCount = farmacias.filter((f) => f.enTurno).length;

  // Hardware: GPS real, con el hook orquestador de permisos envolviendo expo-location
  const { request: pedirPermisoUbicacion } = usePermission(Location.requestForegroundPermissionsAsync);
  const { location, loading: cargandoUbicacion, obtenerUbicacion } = useLocation();

  const handleUsarMiUbicacion = async () => {
    const concedido = await pedirPermisoUbicacion();
    if (concedido) {
      obtenerUbicacion();
    }
  };

  // Si ya tenemos la ubicación real, reemplazamos la distancia mockeada por la
  // calculada de verdad (Haversine) entre el usuario y cada farmacia, y
  // reordenamos la lista de más cerca a más lejos.
  const farmaciasConDistancia = useMemo(() => {
    if (!location) return farmacias;
    return farmacias
      .map((f) => ({
        ...f,
        distanciaMetros: calcularDistanciaMetros(location.latitude, location.longitude, f.latitud, f.longitud),
      }))
      .sort((a, b) => a.distanciaMetros - b.distanciaMetros);
  }, [farmacias, location]);

  const medicamentosFiltrados = useMemo(() => {
    return medicamentos.filter((m) => {
      const coincideCategoria = categoriaActiva === 'Todos' || m.categoria === categoriaActiva;
      const coincideBusqueda = m.nombre.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
  }, [busqueda, categoriaActiva, medicamentos]);

  // useCallback: mantiene la MISMA referencia de función entre renders. Sin esto,
  // React.memo en las tarjetas no serviría de nada, porque recibirían una función
  // "nueva" en cada letra que se tipea en el buscador.
  const handleAgregarAlCarrito = useCallback(
    (medicamento: Medicamento) => addItem(medicamento),
    [addItem] // addItem es estable: ver CartContext
  );

  const handleVerDetalle = useCallback((medicamento: Medicamento) => {
    router.push(`/medicamento/${medicamento.id}`);
  }, []);

  const handleIrAlCarrito = useCallback(() => router.push('/(tabs)/carrito'), []);

  // En FlashList v2 conviene memoizar las props que se le pasan a la lista
  const renderFarmacia = useCallback(
    ({ item }: { item: Farmacia }) => <FarmaciaCard farmacia={item} />,
    []
  );
  const renderMedicamento = useCallback(
    ({ item }: { item: Medicamento }) => (
      <MedicamentoCard medicamento={item} onAgregar={handleAgregarAlCarrito} onPress={handleVerDetalle} />
    ),
    [handleAgregarAlCarrito, handleVerDetalle]
  );
  const keyExtractor = useCallback((item: { id: string }) => item.id, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Logo size={36} style={{ marginRight: Spacing.sm }} />
          <View>
            <Text style={styles.appName}>MapFarma</Text>
            <Text style={styles.greeting}>
              {usuario ? `Hola, ${usuario.nombre} 👋` : 'Bienvenido'}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={12} color={Colors.textMuted} />
              <Text style={styles.locationText}>Pilar, Buenos Aires</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={styles.cartButton}
          onPress={handleIrAlCarrito}
          accessibilityRole="button"
          accessibilityLabel={`Ir al carrito, ${cartCount} ${cartCount === 1 ? 'producto' : 'productos'}`}
        >
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
          accessibilityRole="tab"
          accessibilityLabel="Farmacias"
          accessibilityState={{ selected: subTab === 'farmacias' }}
        >
          <Text style={[styles.subTabText, subTab === 'farmacias' && styles.subTabTextActive]}>
            Farmacias
          </Text>
          {subTab === 'farmacias' && <View style={styles.subTabIndicator} />}
        </Pressable>
        <Pressable
          style={styles.subTabButton}
          onPress={() => setSubTab('medicamentos')}
          accessibilityRole="tab"
          accessibilityLabel="Medicamentos"
          accessibilityState={{ selected: subTab === 'medicamentos' }}
        >
          <Text style={[styles.subTabText, subTab === 'medicamentos' && styles.subTabTextActive]}>
            Medicamentos
          </Text>
          {subTab === 'medicamentos' && <View style={styles.subTabIndicator} />}
        </Pressable>
      </View>

      {subTab === 'farmacias' ? (
        cargandoFarmacias ? (
          <SkeletonList cantidad={4} alto={90} />
        ) : errorFarmacias ? (
          <ErrorView mensaje={`No pudimos cargar las farmacias: ${errorFarmacias}`} />
        ) : (
          <FlashList
            key="farmacias-list"
            data={farmaciasConDistancia}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <>
                <MapaFarmacias farmacias={farmaciasConDistancia} ubicacion={location} />

                <Pressable
                  style={styles.locationButton}
                  onPress={handleUsarMiUbicacion}
                  disabled={cargandoUbicacion}
                  accessibilityRole="button"
                  accessibilityLabel="Usar mi ubicación para calcular las distancias a las farmacias"
                >
                  <Ionicons name="locate" size={16} color={Colors.white} />
                  <Text style={styles.locationButtonText}>
                    {cargandoUbicacion
                      ? 'Buscando...'
                      : location
                      ? 'Actualizar mi ubicación'
                      : 'Usar mi ubicación (distancias reales)'}
                  </Text>
                </Pressable>

                <View style={styles.turnoRow}>
                  <View style={styles.turnoDot} />
                  <Text style={styles.turnoText}>
                    {enTurnoCount} de {farmacias.length} en turno
                  </Text>
                </View>
              </>
            }
            ListEmptyComponent={
              <Text style={styles.vacioText}>No hay farmacias cargadas todavía.</Text>
            }
            renderItem={renderFarmacia}
          />
        )
      ) : cargandoMedicamentos ? (
        <SkeletonList cantidad={6} alto={140} />
      ) : errorMedicamentos ? (
        <ErrorView mensaje={`No pudimos cargar los medicamentos: ${errorMedicamentos}`} />
      ) : (
        <FlashList
          key="medicamentos-list"
          data={medicamentosFiltrados}
          keyExtractor={keyExtractor}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color={Colors.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar medicamento..."
                  placeholderTextColor={Colors.textMuted}
                  accessibilityLabel="Buscar medicamento"
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
                    accessibilityRole="button"
                    accessibilityLabel={`Filtrar por ${item}`}
                    accessibilityState={{ selected: categoriaActiva === item }}
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
          renderItem={renderMedicamento}
        />
      )}
    </View>
  );
}

const makeStyles = (Colors: ThemeColors) => StyleSheet.create({
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
  vacioText: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    marginTop: Spacing.xl,
  },

  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  locationButtonText: { color: Colors.white, fontSize: FontSize.sm, fontFamily: FontFamily.bold, marginLeft: Spacing.xs },

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
    backgroundColor: Colors.surface,
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  categoryPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryPillText: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.textMuted },
  categoryPillTextActive: { color: Colors.white },
});
