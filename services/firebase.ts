// services/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-ignore: getReactNativePersistence existe en runtime (bundle de React Native),
// pero algunas versiones no lo incluyen en los tipos de TypeScript.
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Las variables EXPO_PUBLIC_* son inyectadas automáticamente por Expo
// desde el archivo .env (que NUNCA se commitea).
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FB_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FB_MSG_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FB_APP_ID,
};

// getApps().length evita re-inicializar la app en los fast-refresh de Expo Go
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth con persistencia local: la sesión sobrevive al cerrar y abrir la app.
// initializeAuth tira error si se llama dos veces (fast refresh), por eso el try/catch.
function crearAuth() {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
}

// Firestore con "long polling" automático: en muchas redes (WiFi de instituto,
// antivirus, firewall, algunos celulares) el canal por defecto se corta y aparece
// "Could not reach Cloud Firestore backend". Con esta opción el SDK detecta el
// problema y cambia solo a long polling.
// initializeFirestore también tira error si se llama dos veces (fast refresh): fallback a getFirestore.
function crearFirestore() {
  try {
    return initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  } catch {
    return getFirestore(app);
  }
}

export const auth = crearAuth();
export const db = crearFirestore();
