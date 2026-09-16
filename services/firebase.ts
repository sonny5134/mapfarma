// services/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Las variables EXPO_PUBLIC_* son inyectadas automáticamente por Expo,
// sin necesidad de app.config.ts. Se definen en el archivo .env (NUNCA se commitea).
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
export const db = getFirestore(app);
