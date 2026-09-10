// app/(tabs)/perfil.tsx
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Radius, FontFamily } from '../../constants/theme';
import { useUser } from '../../contexts/UserContext';

export default function PerfilScreen() {
  const { usuario, misProductos, logout } = useUser();

  const handleCerrarSesion = () => {
    logout();
    router.replace('/login');
  };

  if (!usuario) {
    // No debería pasar en el flujo normal (login/registro siempre setean el usuario),
    // pero por las dudas evitamos que la pantalla explote si se entra sin sesión.
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay sesión activa.</Text>
      </View>
    );
  }

  const inicial = usuario.nombre.trim().charAt(0).toUpperCase();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>MI CUENTA</Text>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      {/* Card de datos */}
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{inicial}</Text>
          </View>
          <View style={styles.cardTopInfo}>
            <Text style={styles.nombre}>{usuario.nombre}</Text>
            <Text style={styles.email} numberOfLines={1}>{usuario.email}</Text>
          </View>
          <Pressable style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rol</Text>
          <Text style={styles.infoValue}>🛠️ {usuario.rol}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Teléfono</Text>
          <Text style={styles.infoValue}>{usuario.telefono || '—'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Miembro desde</Text>
          <Text style={styles.infoValueBold}>{usuario.miembroDesde}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pedidos realizados</Text>
          <Text style={styles.infoValueBold}>{usuario.pedidosRealizados}</Text>
        </View>
      </View>

      {/* Mis productos */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>MIS PRODUCTOS ({misProductos.length})</Text>
        <Pressable onPress={() => router.push('/(tabs)/publicar')}>
          <Text style={styles.sectionAction}>+ Agregar</Text>
        </Pressable>
      </View>

      {misProductos.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyBoxText}>Todavía no publicaste ningún medicamento.</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/(tabs)/publicar')}>
            <Text style={styles.primaryButtonText}>Publicar medicamento</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.productosListContainer}>
          {misProductos.map((producto) => (
            <View key={producto.id} style={styles.productoCard}>
              {producto.imagenUrl ? (
                <Image source={{ uri: producto.imagenUrl }} style={styles.productoImagen} />
              ) : (
                <View style={styles.productoImagenPlaceholder} />
              )}
              <View style={styles.productoInfo}>
                <Text style={styles.productoNombre} numberOfLines={1}>{producto.nombre}</Text>
                <Text style={styles.productoCategoria}>{producto.categoria}</Text>
                <Text style={styles.productoPrecio}>
                  ${producto.precio.toLocaleString('es-AR')} · Stock: {producto.stock}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Historial de pedidos */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>HISTORIAL DE PEDIDOS (0)</Text>
      </View>
      <View style={styles.emptyBox}>
        <Text style={styles.emptyBoxText}>Todavía no realizaste ningún pedido.</Text>
      </View>

      {/* Cerrar sesión */}
      <Pressable style={styles.logoutButton} onPress={handleCerrarSesion}>
        <Text style={styles.logoutButtonText}>CERRAR SESIÓN</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: Spacing.xxl },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: FontSize.md, fontFamily: FontFamily.regular, color: Colors.textMuted },

  header: {
    backgroundColor: Colors.cardBg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  headerLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: FontSize.xxxl,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
    marginTop: 2,
  },

  card: {
    backgroundColor: Colors.white,
    margin: Spacing.lg,
    marginTop: -Spacing.md,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: { color: Colors.white, fontSize: FontSize.xl, fontFamily: FontFamily.bold },
  cardTopInfo: { flex: 1 },
  nombre: { fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.primary },
  email: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },
  editButton: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  editButtonText: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.primary },

  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm + 2,
  },
  infoLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted },
  infoValue: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.text },
  infoValueBold: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.primary },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  sectionAction: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.secondary },

  emptyBox: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyBoxText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },

  productosListContainer: { paddingHorizontal: Spacing.lg },
  productoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productoImagen: { width: 48, height: 48, borderRadius: Radius.sm, marginRight: Spacing.sm },
  productoImagenPlaceholder: {
    width: 48, height: 48, borderRadius: Radius.sm,
    backgroundColor: Colors.cardBg, marginRight: Spacing.sm,
  },
  productoInfo: { flex: 1, justifyContent: 'center' },
  productoNombre: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.primary },
  productoCategoria: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 1 },
  productoPrecio: { fontSize: FontSize.xs, fontFamily: FontFamily.bold, color: Colors.text, marginTop: 2 },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.md,
  },
  primaryButtonText: { color: Colors.white, fontSize: FontSize.sm, fontFamily: FontFamily.bold },

  logoutButton: {
    backgroundColor: '#FDECEC',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  logoutButtonText: { color: Colors.danger, fontSize: FontSize.md, fontFamily: FontFamily.bold },
});
