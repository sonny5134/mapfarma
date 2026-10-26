// services/api.ts — Configuración global de Axios
// Instalar: npx expo install axios
import axios from 'axios';
import { tokenService } from './tokenService';

// Si definís EXPO_PUBLIC_API_URL en el .env, se usa tu API propia. Si no, se usa DummyJSON,
// una API pública de prueba (solo para el taller de la Clase 12).
const API_PROPIA = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_PROPIA || 'https://dummyjson.com',
  timeout: 10000, // corta la petición si el backend no responde en 10 segundos
});

// INTERCEPTOR DE REQUEST: se ejecuta ANTES de que la petición salga del celular
api.interceptors.request.use(async (config) => {
  // Seguridad: el token de sesión solo viaja a NUESTRA API. Nunca se le manda a una API de terceros.
  if (API_PROPIA) {
    const token = await tokenService.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// INTERCEPTOR DE RESPONSE: se ejecuta al recibir la respuesta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token vencido: lo borramos del almacenamiento seguro.
      await tokenService.clear();
    }
    return Promise.reject(error);
  }
);
