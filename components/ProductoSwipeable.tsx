// components/ProductoSwipeable.tsx
import { memo } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
// En Reanimated 4, runOnJS fue reemplazado por scheduleOnRN (viene en react-native-worklets)
import { scheduleOnRN } from 'react-native-worklets';
import { Colors, Spacing, FontSize, Radius, FontFamily } from '../constants/theme';
import { Medicamento } from '../types';

interface Props {
  producto: Medicamento;
  onPress: (producto: Medicamento) => void;
  // Se llama cuando la persona desliza más allá del umbral (o usa la acción de accesibilidad).
  // La pantalla es la que pide confirmación y borra en Firestore.
  onDelete: (id: string, nombre: string) => void;
}

const UMBRAL_BORRAR = -100;

function ProductoSwipeableBase({ producto, onPress, onDelete }: Props) {
  // useSharedValue vive en el hilo de UI: se actualiza sin pasar por el hilo de JS
  const tx = useSharedValue(0);

  const pan = Gesture.Pan()
    // Solo "gana" el gesto si el movimiento es horizontal: así no pelea con el scroll vertical
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      // Fase 2: arrastrando (solo permitimos deslizar hacia la izquierda)
      tx.value = Math.min(0, e.translationX);
    })
    .onEnd(() => {
      // Fase 3: si superó el umbral, avisamos a JS para pedir la confirmación de borrado
      if (tx.value < UMBRAL_BORRAR) {
        // scheduleOnRN es el PUENTE: el worklet vive en el hilo de UI y no puede llamar
        // directamente a funciones de JS (Alert, Firestore, etc.)
        scheduleOnRN(onDelete, producto.id, producto.nombre);
      }
      // Siempre vuelve a su lugar: si la baja se confirma, el onSnapshot de Firestore
      // saca la tarjeta de la lista con la animación de salida (exiting).
      tx.value = withSpring(0);
    });

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
  }));

  return (
    // Animaciones de layout: entra con fade, sale con fade y las demás se acomodan suave
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      layout={LinearTransition}
      style={styles.container}
    >
      {/* Fondo rojo que se descubre al deslizar */}
      <View style={styles.fondoEliminar}>
        <Ionicons name="trash-outline" size={22} color={Colors.white} />
        <Text style={styles.fondoTexto}>Eliminar</Text>
      </View>

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.card, estiloAnimado]}>
          <Pressable
            style={styles.contenido}
            onPress={() => onPress(producto)}
            accessibilityRole="button"
            accessibilityLabel={`${producto.nombre}, $${producto.precio}, stock ${producto.stock}`}
            accessibilityHint="Abre el detalle. Deslizá hacia la izquierda para eliminar."
            // El deslizar no lo puede hacer un lector de pantalla: le damos una acción equivalente
            accessibilityActions={[{ name: 'eliminar', label: 'Eliminar producto' }]}
            onAccessibilityAction={(e) => {
              if (e.nativeEvent.actionName === 'eliminar') onDelete(producto.id, producto.nombre);
            }}
          >
            {producto.imagenUrl ? (
              <Image
                source={{ uri: producto.imagenUrl }}
                style={styles.imagen}
                accessibilityRole="image"
                accessibilityLabel={`Foto de ${producto.nombre}`}
              />
            ) : (
              <View style={styles.imagenPlaceholder} />
            )}
            <View style={styles.info}>
              <Text style={styles.nombre} numberOfLines={1}>{producto.nombre}</Text>
              <Text style={styles.categoria}>{producto.categoria}</Text>
              <Text style={styles.precio}>
                ${producto.precio.toLocaleString('es-AR')} · Stock: {producto.stock}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

// memo(): solo se redibuja si cambia el producto o las funciones (que vienen estables con useCallback)
export const ProductoSwipeable = memo(ProductoSwipeableBase);

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.sm, borderRadius: Radius.md, overflow: 'hidden' },

  fondoEliminar: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: Spacing.lg,
    borderRadius: Radius.md,
  },
  fondoTexto: { color: Colors.white, fontFamily: FontFamily.bold, fontSize: FontSize.sm, marginLeft: Spacing.xs },

  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contenido: { flexDirection: 'row', alignItems: 'center', padding: Spacing.sm },
  imagen: { width: 48, height: 48, borderRadius: Radius.sm, marginRight: Spacing.sm },
  imagenPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    backgroundColor: Colors.cardBg,
    marginRight: Spacing.sm,
  },
  info: { flex: 1, justifyContent: 'center' },
  nombre: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.primary },
  categoria: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 1 },
  precio: { fontSize: FontSize.xs, fontFamily: FontFamily.bold, color: Colors.text, marginTop: 2 },
});
