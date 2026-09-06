// app/_layout.tsx
import { Stack } from 'expo-router';
import { CartProvider } from '../contexts/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CartProvider>
  );
}
