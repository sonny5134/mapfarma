// constants/theme.ts
// MapFarma — Paleta, tipografía y escalas del proyecto
// Basado en el mockup de Figma (paleta_de_colores_y_logo.jpeg + tipografía.jpeg)

export const Colors = {
  primary:     '#01475D', // primario — headers, botones principales, textos fuertes
  secondary:   '#00D6BD', // secundario — acentos, badges "en turno", precios, checks
  cardBg:      '#E5CDF5', // fondo de tarjetas / imágenes de producto
  background:  '#F9F9F9', // fondo general de la app

  success:     '#00BF00', // confirmaciones (pedido confirmado, en stock)
  danger:      '#FF0000', // errores (sin stock, campo inválido)

  text:        '#01475D', // texto principal (mismo tono que primario)
  textMuted:   '#64748B', // texto secundario / labels
  white:       '#FFFFFF',
  border:      '#E2E8F0',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSize = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Tipografía del mockup: Inter Bold para títulos/énfasis, Open Sans Regular para texto
// Recordá instalar las fuentes con expo-font y cargarlas en el _layout.tsx raíz:
//   npx expo install expo-font @expo-google-fonts/inter @expo-google-fonts/open-sans
export const FontFamily = {
  bold:    'Inter_700Bold',
  regular: 'OpenSans_400Regular',
};

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  full: 999,
};