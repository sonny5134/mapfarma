// app/_layout.tsx
import { Stack } from 'expo-router';
import { CartProvider } from '../contexts/CartContext';
import { UserProvider } from '../contexts/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </CartProvider>
    </UserProvider>
  );
}
