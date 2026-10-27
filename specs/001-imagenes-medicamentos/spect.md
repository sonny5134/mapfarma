# Especificación: Imágenes de medicamentos

**Rama**: `sonny` · **Estado**: Implementada · **Constitución**: v1.0.0

## Problema
Las tarjetas del catálogo, el detalle y el carrito muestran solo un recuadro lila. Quien busca un medicamento no puede reconocerlo visualmente.

## Historias de usuario
1. **Como cliente**, quiero ver la foto del medicamento en la grilla para reconocerlo rápido. *(P1)*
2. **Como cliente**, quiero ver la foto grande en el detalle. *(P1)*
3. **Como cliente**, quiero ver una miniatura en el carrito para confirmar qué estoy pidiendo. *(P2)*
4. **Como vendedor**, quiero que mi foto publicada se vea en las demás pantallas. *(P2)*

## Requisitos funcionales
- **RF-01** Si `imagenUrl` existe y carga, se muestra en `MedicamentoCard`, detalle y carrito.
- **RF-02** Si no existe o falla la carga, se muestra el recuadro lila actual (sin pantalla rota ni parpadeo de error).
- **RF-03** Los badges "Receta" y "Sin stock" siguen visibles encima de la imagen.
- **RF-04** El campo `imagenUrl` es opcional en Firestore y se carga como URL https pública.

## Criterios de aceptación
- Un medicamento con `imagenUrl` válida se ve en las tres pantallas.
- Un medicamento sin `imagenUrl` se ve igual que antes.
- Una URL rota cae al recuadro lila.
- `npx tsc --noEmit` y `npm test` en verde.

## Fuera de alcance
Subida a la nube de fotos tomadas con la cámara (requiere Firebase Storage/Blaze). Las fotos locales (`file://`) solo se ven en el celular que las tomó.

## Preguntas abiertas
- [ ] ¿Alojar imágenes en un servicio gratuito o usar base64 comprimido en Firestore?
