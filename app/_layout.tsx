// app/_layout.tsx
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import Toast from 'react-native-toast-message';
import { CartProvider } from '../contexts/CartContext';
import { UserProvider, useUser } from '../contexts/UserContext';
import { Colors } from '../constants/theme';

// El Auth Guard necesita leer el UserContext, así que vive en un componente
// hijo de los Providers (RootLayout solo los arma).
function RootNavigator() {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { usuario, ready } = useUser();

  // Auth Guard: expulsa a quien no tiene sesión y saca del login a quien ya la tiene
  useEffect(() => {
    if (!ready || !navigationState?.key) return; // esperamos a que todo esté montado
    const enAuth = segments[0] === '(auth)';

    if (!usuario && !enAuth) {
      router.replace('/login');
    } else if (usuario && enAuth) {
      router.replace('/(tabs)');
    }
  }, [usuario, segments, ready, navigationState?.key]);

  // Mientras Firebase restaura la sesión no montamos ninguna pantalla:
  // así Firestore no recibe pedidos "sin sesión" que las reglas rechazarían.
  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Grupo (tabs) — Home, Publicar, Carrito, Perfil, con su propio Tab Navigator */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Grupo (auth) — Login y Registro, sin header nativo (diseño custom propio) */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/* Checkout usa header nativo con flecha "Atrás" automática */}
        <Stack.Screen
          name="checkout"
          options={{
            headerShown: true,
            title: 'Checkout',
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: Colors.white,
          }}
        />
      </Stack>
      {/* Fuera del Stack: para que los Toasts floten por encima de toda la navegación */}
      <Toast />
    </>
  );
}

export default function RootLayout() {
  return (
    <UserProvider>
      <CartProvider>
        <RootNavigator />
      </CartProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
});
