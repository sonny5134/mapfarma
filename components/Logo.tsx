// components/Logo.tsx
// Logo oficial de MapFarma (assets/logo.png). Reemplaza al corazón provisorio de Ionicons.
import { Image, ImageStyle, StyleProp } from 'react-native';

interface Props {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export function Logo({ size = 48, style }: Props) {
  return (
    <Image
      source={require('../assets/logo.png')}
      style={[{ width: size, height: size }, style]}
      accessibilityRole="image"
      accessibilityLabel="Logo de MapFarma"
    />
  );
}
