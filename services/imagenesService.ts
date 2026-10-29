// services/imagenesService.ts
// Sube una foto a Cloudinary (plan gratuito, sin tarjeta) y devuelve un link https
// que se ve en cualquier celular. Es el reemplazo de Firebase Storage, que exige plan Blaze.
//
// La subida es "unsigned": no lleva ninguna clave secreta, solo el nombre del cloud y el
// nombre de un "upload preset" que configuramos en el panel de Cloudinary.

// Valores por defecto para TODO el grupo: así nadie tiene que configurar nada.
// Reemplazá el texto entre comillas con el Cloud name de tu cuenta de Cloudinary.
// (Si alguien define las variables EXPO_PUBLIC_CLOUDINARY_* en su .env, esas tienen prioridad.)
const CLOUD_NAME_POR_DEFECTO = 'uqu0afs8';
const UPLOAD_PRESET_POR_DEFECTO = 'mapfarma';

// Se leen así (no con process.env[nombre]) para que Expo los reemplace al compilar.
const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || CLOUD_NAME_POR_DEFECTO;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || UPLOAD_PRESET_POR_DEFECTO;

function enviar(url: string, formData: FormData): Promise<{ ok: boolean; datos: any }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onload = () => {
      try {
        resolve({ ok: xhr.status >= 200 && xhr.status < 300, datos: JSON.parse(xhr.responseText) });
      } catch {
        reject(new Error('Respuesta inválida de Cloudinary.'));
      }
    };
    xhr.onerror = () => reject(new Error('No se pudo conectar con Cloudinary. Revisá tu conexión.'));
    xhr.send(formData);
  });
}

export const imagenesService = {
  /** Sube la foto local (file://...) y devuelve su URL https. Lanza un Error si falla. */
  async subir(uriLocal: string): Promise<string> {
    if (CLOUD_NAME === 'REEMPLAZAR_CON_TU_CLOUD_NAME') {
      throw new Error('Falta escribir el Cloud name de Cloudinary en services/imagenesService.ts.');
    }

    const formData = new FormData();
    // En React Native, un archivo se adjunta como { uri, type, name }
    formData.append('file', { uri: uriLocal, type: 'image/jpeg', name: 'foto.jpg' } as any);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'mapfarma');

    // Se usa XMLHttpRequest y no fetch: el fetch de Expo SDK 57 no soporta adjuntar archivos
    // con { uri, type, name } ("Unsupported FormDataPart implementation"), pero XHR sí.
    const { ok, datos } = await enviar(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );

    if (!ok || !datos.secure_url) {
      throw new Error(datos?.error?.message ?? 'No se pudo subir la foto.');
    }

    // Pedimos la imagen ya achicada (máx. 800 px de ancho) para que la lista cargue rápido
    return (datos.secure_url as string).replace('/upload/', '/upload/c_limit,w_800,q_auto/');
  },
};
