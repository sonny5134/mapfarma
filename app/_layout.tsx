// app/_layout.tsx
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CartProvider } from '../contexts/CartContext';
import { UserProvider, useUser } from '../contexts/UserContext';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

// El Auth Guard necesita leer el UserContext, así que vive en un componente
// hijo de los Providers (RootLayout solo los arma).
function RootNavigator() {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { usuario, ready } = useUser();
  const { colors: Colors, isDark } = useTheme();

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
      <View style={[styles.loading, { backgroundColor: Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
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
    // Necesario para que los gestos (Swipe-to-Delete) funcionen en toda la app
    <GestureHandlerRootView style={styles.gestureRoot}>
      <ThemeProvider>
        <UserProvider>
          <CartProvider>
            <RootNavigator />
          </CartProvider>
        </UserProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
