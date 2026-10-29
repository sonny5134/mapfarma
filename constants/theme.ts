// constants/theme.ts
// MapFarma — Paleta, tipografía y escalas del proyecto
// Basado en el mockup de Figma (paleta_de_colores_y_logo.jpeg + tipografía.jpeg)

// Los colores ahora tienen dos versiones (claro y oscuro). Las pantallas NO importan
// estos objetos directo: usan useTheme() de contexts/ThemeContext.tsx.
export interface ThemeColors {
  primary: string;
  secondary: string;
  cardBg: string;
  background: string;
  surface: string;     // fondo de tarjetas, inputs y barras (antes Colors.white)
  success: string;
  danger: string;
  text: string;
  textMuted: string;
  white: string;       // blanco fijo: solo para texto/íconos sobre botones de color
  border: string;
  successBg: string;   // fondo suave de badges "en stock / en turno"
  dangerBg: string;    // fondo suave de avisos de error
  neutralBg: string;   // fondo suave de badges "sin turno"
  overlay: string;     // velo sobre imágenes "sin stock"
}

export const LightColors: ThemeColors = {
  primary:     '#01475D', // primario — headers, botones principales, textos fuertes
  secondary:   '#00D6BD', // secundario — acentos, badges "en turno", precios, checks
  cardBg:      '#E5CDF5', // fondo de tarjetas / imágenes de producto
  background:  '#F9F9F9', // fondo general de la app
  surface:     '#FFFFFF',

  success:     '#00BF00', // confirmaciones (pedido confirmado, en stock)
  danger:      '#FF0000', // errores (sin stock, campo inválido)

  text:        '#01475D', // texto principal (mismo tono que primario)
  textMuted:   '#64748B', // texto secundario / labels
  white:       '#FFFFFF',
  border:      '#E2E8F0',

  successBg:   '#E7F9E7',
  dangerBg:    '#FDECEC',
  neutralBg:   '#F1F1F1',
  overlay:     'rgba(255,255,255,0.6)',
};

export const DarkColors: ThemeColors = {
  primary:     '#2A9DBF', // versión más clara del primario: legible como texto y como botón
  secondary:   '#00D6BD',
  cardBg:      '#3A2A4A', // lila oscuro
  background:  '#0F1A1F',
  surface:     '#17262D',

  success:     '#2ECC71',
  danger:      '#FF5A5A',

  text:        '#E8F1F4',
  textMuted:   '#94A3B8',
  white:       '#FFFFFF',
  border:      '#2A3B44',

  successBg:   '#12351F',
  dangerBg:    '#3A1A1A',
  neutralBg:   '#26343B',
  overlay:     'rgba(15,26,31,0.65)',
};

// Compatibilidad: código que todavía importe `Colors` sigue viendo el tema claro.
export const Colors = LightColors;

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
