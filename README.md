# MapFarma 💊📍

[![Tests](https://github.com/sonny5134/mapfarma/actions/workflows/test.yml/badge.svg)](https://github.com/sonny5134/mapfarma/actions/workflows/test.yml)

Aplicación móvil que usa el GPS del celular para mostrar las **farmacias de turno en Pilar, Buenos Aires**, ordenadas por distancia real, con un **carrito de compras** para encargar medicamentos y retirarlos de forma presencial en la farmacia elegida.

> **El problema:** encontrar una farmacia de turno abierta y saber si tiene el medicamento que necesitás obliga a llamar o recorrer. MapFarma muestra todo en un solo lugar: qué farmacia está de turno, qué tan lejos está y qué stock tiene.

## Capturas

| Inicio                         | Medicamentos                           | Carrito                      | Perfil                     |
| ------------------------------ | -------------------------------------- | ---------------------------- | -------------------------- |
| ![Inicio](docs/screenshot.png) | ![Medicamentos](docs/medicamentos.png) | ![Carrito](docs/carrito.png) | ![Perfil](docs/perfil.png) |

## Descargar la app (Android)

📲 **[Descargar MapFarma (.apk)](REEMPLAZAR_CON_EL_LINK_DEL_BUILD)**

1. Abrí el link desde tu celular Android (o escaneá el QR de la página del build).
2. Descargá el archivo `.apk`.
3. Al abrirlo, Android te va a pedir permiso para **instalar apps de orígenes desconocidos**: aceptalo solo para este archivo.
4. Abrí MapFarma, registrate con un email y listo.

## Integrantes

- Sonny Francisco López Villanueva — Desarrollador
- Luciano Federico Eurolo — Desarrollador
- Facundo Valentín Torrente — Desarrollador
- Francesco Paolo Villarroel Galarza — Desarrollador
- Martín Javier Muñoz Ayala — Desarrollador
- Gustavo Ezequiel Zapata — Desarrollador

## Funcionalidades

- **Autenticación real** con Firebase Authentication (email y contraseña), sesión persistente y redirección automática según la sesión (Auth Guard).
- **Farmacias en tiempo real** con Firestore (`onSnapshot`): si cambia un dato en la base, la app se actualiza sola.
- **GPS real:** calcula la distancia a cada farmacia (fórmula de Haversine) y las reordena de la más cercana a la más lejana.
- **Catálogo de medicamentos** con búsqueda, filtro por categoría y detalle.
- **Carrito y checkout** con manejo de medicamentos que requieren receta (foto con cámara o galería).
- **CRUD completo:** publicar, editar y eliminar medicamentos propios, con formularios validados (React Hook Form + Zod).
- **Seguridad:** Firestore Security Rules por usuario: solo el dueño de un producto puede editarlo o borrarlo.
- **Rendimiento y UX:** listas con FlashList, componentes memoizados, Swipe-to-Delete animado y accesibilidad (`accessibilityLabel` / `accessibilityRole`).

## Stack y dependencias

| Área          | Tecnología                                                   |
| ------------- | ------------------------------------------------------------ |
| Framework     | Expo SDK 57 + React Native 0.86 + TypeScript                 |
| Navegación    | Expo Router (file-based routing, grupos `(tabs)` y `(auth)`) |
| Backend       | Firebase Authentication + Cloud Firestore                    |
| Estado global | Context API (`UserContext`, `CartContext`)                   |
| Formularios   | React Hook Form + Zod                                        |
| Listas        | `@shopify/flash-list`                                        |
| Animaciones   | `react-native-reanimated` + `react-native-gesture-handler`   |
| Hardware      | `expo-location`, `expo-image-picker`, `expo-secure-store`    |
| Feedback      | `react-native-toast-message`                                 |
| Testing       | Jest (`jest-expo`) + React Native Testing Library            |
| Build y CI    | EAS Build + GitHub Actions                                   |

## Cómo correr el proyecto en desarrollo

```bash
git clone https://github.com/sonny5134/mapfarma.git
cd mapfarma
npm install
```

Creá un archivo `.env` en la raíz con las credenciales de tu proyecto de Firebase (este archivo **no** se sube a GitHub):

```
EXPO_PUBLIC_FB_API_KEY=...
EXPO_PUBLIC_FB_AUTH_DOMAIN=...
EXPO_PUBLIC_FB_PROJECT_ID=...
EXPO_PUBLIC_FB_STORAGE_BUCKET=...
EXPO_PUBLIC_FB_MSG_SENDER_ID=...
EXPO_PUBLIC_FB_APP_ID=...
```

```bash
npx expo start
```

Escaneá el QR con **Expo Go** para verlo en tu celular.

## Tests

```bash
npm test
```

Los tests corren automáticamente en cada Pull Request con GitHub Actions (ver el badge de arriba).

## Generar el build (EAS)

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview   # genera el .apk instalable
```

Los perfiles `development`, `preview` y `production` están definidos en `eas.json`.

## Estructura de carpetas

```
mapfarma/
├── app/                    # Pantallas (cada archivo es una ruta)
│   ├── _layout.tsx         # Layout raíz + Auth Guard
│   ├── (auth)/             # login y registro
│   ├── (tabs)/             # Inicio, Publicar, Carrito, Perfil
│   ├── medicamento/[id].tsx
│   ├── editar/[id].tsx
│   └── checkout.tsx
├── components/             # Componentes reutilizables (cards, InputField, etc.)
├── contexts/               # Estado global (usuario y carrito)
├── hooks/                  # Hooks personalizados (Firestore, GPS, permisos)
├── services/               # Capa de acceso a Firebase y SecureStore
├── schemas/                # Validaciones con Zod
├── constants/theme.ts      # Colores, tipografía y espaciados
├── types/                  # Interfaces de TypeScript
├── utils/                  # Funciones auxiliares (distancia)
└── __tests__/              # Tests con Jest y Testing Library
```

## Paleta de colores

| Color          | Hex       | Uso                                  |
| -------------- | --------- | ------------------------------------ |
| Primario       | `#01475D` | Headers, botones principales, textos |
| Secundario     | `#00D6BD` | Acentos, badges, precios             |
| Fondo tarjetas | `#E5CDF5` | Tarjetas e imágenes de producto      |
| Fondo app      | `#F9F9F9` | Fondo general                        |
| Confirmaciones | `#00BF00` | Estados positivos                    |
| Errores        | `#FF0000` | Errores y sin stock                  |
