// services/tokenService.ts — almacenamiento seguro para el token de sesión (JWT)
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'mapfarma_session_token';
const USER_ID_KEY = 'mapfarma_session_user_id';

// Nunca guardamos tokens/contraseñas en AsyncStorage (texto plano) — SecureStore
// usa el Keychain (iOS) / Keystore (Android), cifrado a nivel de sistema operativo.
export const tokenService = {
  // Guardar el token al hacer login real (Clase 8, con Firebase Authentication)
  save: async (token: string, userId: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_ID_KEY, userId);
  },

  get: () => SecureStore.getItemAsync(TOKEN_KEY),
  getUserId: () => SecureStore.getItemAsync(USER_ID_KEY),

  // Eliminar al hacer logout
  clear: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_ID_KEY);
  },
};
