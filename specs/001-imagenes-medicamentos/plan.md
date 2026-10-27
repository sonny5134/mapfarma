# Plan técnico: Imágenes de medicamentos

## Verificación contra la constitución
- II (capas): sin cambios en servicios; la UI solo lee `Medicamento.imagenUrl`, ya existente en `types/index.ts`. ✔
- III (datos): sin Firebase Storage; URLs https. ✔
- IV (calidad): `Image` nativo de React Native, `accessibilityIgnoresInvertColors`. ✔

## Cambios
| Archivo | Cambio |
|---|---|
| `components/MedicamentoCard.tsx` | `<Image>` absoluto dentro del recuadro; estado `falloImagen` con `onError`; `overflow: 'hidden'` |
| `app/medicamento/[id].tsx` | Misma lógica en el encabezado de 220 px |
| `app/(tabs)/carrito.tsx` | Miniatura de 40×40 en cada línea |
| Firestore (manual) | Campo `imagenUrl` (string) en cada documento de `medicamentos` |

## Decisiones
- Se conserva el recuadro lila como fondo: hace de *placeholder* mientras carga y de *fallback* si falla.
- No se agrega librería (`expo-image`) todavía: no hay requisito de caché en disco.

## Riesgos
- URLs de terceros pueden caerse → cubierto por RF-02.
- `file://` de otro dispositivo no carga → documentado como fuera de alcance.
