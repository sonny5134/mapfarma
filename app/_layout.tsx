// app/_layout.tsx
import { Stack } from 'expo-router';
import { CartProvider } from '../contexts/CartContext';
import { UserProvider } from '../contexts/UserContext';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <UserProvider>
      <CartProvider>
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
      </CartProvider>
    </UserProvider>
  );
}
