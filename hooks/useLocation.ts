// hooks/useLocation.ts
import { useState } from 'react';
import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string; // dirección legible
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerUbicacion = async () => {
    try {
      setLoading(true);
      setError(null);

      // Balanced: ideal para ahorrar batería. Highest drena la energía rápidamente.
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Geocodificación reversa: coordenadas → dirección legible
      let address: string | undefined;
      try {
        const [addr] = await Location.reverseGeocodeAsync({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        address = addr ? `${addr.street ?? ''} ${addr.city ?? ''}`.trim() : undefined;
      } catch {
        // La geocodificación reversa puede fallar sin señal/datos; no es crítico.
      }

      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        address,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { location, loading, error, obtenerUbicacion };
}
