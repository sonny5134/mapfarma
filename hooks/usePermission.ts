// hooks/usePermission.ts
import { useState, useCallback } from 'react';
import { Alert, Linking } from 'react-native';

type PermissionStatus = 'undetermined' | 'granted' | 'denied';

interface UsePermissionResult {
  status: PermissionStatus;
  request: () => Promise<boolean>;
  goToSettings: () => void;
}

// Orquesta CUALQUIER permiso nativo (location, cámara, galería, etc.) pasándole
// la función de pedido correspondiente, ej:
//   usePermission(Location.requestForegroundPermissionsAsync)
//   usePermission(ImagePicker.requestCameraPermissionsAsync)
export function usePermission(
  requestFn: () => Promise<{ status: string; canAskAgain?: boolean }>
): UsePermissionResult {
  const [status, setStatus] = useState<PermissionStatus>('undetermined');

  const request = useCallback(async () => {
    const result = await requestFn();
    if (result.status === 'granted') {
      setStatus('granted');
      return true;
    }

    setStatus('denied');

    // En Android: si canAskAgain es false, el diálogo nativo ya no vuelve a
    // aparecer — hay que mandar a la persona directo a Configuración.
    if (result.canAskAgain === false) {
      Alert.alert(
        'Permiso requerido',
        'Habilitá el permiso desde la configuración del dispositivo.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ir a Configuración', onPress: () => Linking.openSettings() },
        ]
      );
    }
    return false;
  }, [requestFn]);

  const goToSettings = () => Linking.openSettings();

  return { status, request, goToSettings };
}
