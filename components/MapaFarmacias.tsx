// components/MapaFarmacias.tsx
// Mapa visual con OpenStreetMap + Leaflet dentro de un WebView.
// Gratis, sin API key y sin tarjeta: funciona igual en Expo Go y en el APK.
import { memo, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Radius, FontSize, FontFamily, Spacing, ThemeColors } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { Farmacia } from '../types';

interface Props {
  farmacias: Farmacia[];
  ubicacion?: { latitude: number; longitude: number } | null;
  height?: number;
}

// Centro de Pilar: se usa solo si todavía no hay farmacias cargadas
const PILAR = { lat: -34.4587, lng: -58.9137 };

function construirHtml(farmacias: Farmacia[], ubicacion: Props['ubicacion'], oscuro: boolean) {
  const puntos = farmacias.map((f) => ({
    nombre: f.nombre,
    direccion: f.direccion,
    distancia: f.distanciaMetros,
    enTurno: f.enTurno,
    lat: f.latitud,
    lng: f.longitud,
  }));
  // Se serializa como JSON y se escapa "<" para que ningún texto cierre el <script>
  const datos = JSON.stringify({ puntos, yo: ubicacion ?? null, centro: PILAR, oscuro }).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>
  html,body,#map{height:100%;margin:0;padding:0;background:${oscuro ? '#0F1A1F' : '#E5CDF5'};font-family:sans-serif}
  ${oscuro ? '.leaflet-tile-pane{filter:invert(1) hue-rotate(180deg) brightness(0.9) contrast(0.85);}' : ''}
  .pop b{color:#01475D} .pop small{color:#64748B}
</style>
</head><body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var D = ${datos};
  var map = L.map('map', { zoomControl: true, attributionControl: true })
              .setView([D.centro.lat, D.centro.lng], 14);
  // Modo oscuro: mismos mosaicos de OpenStreetMap (gratis, sin clave) con el color invertido por CSS
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  var bounds = [];
  D.puntos.forEach(function (p) {
    if (typeof p.lat !== 'number' || typeof p.lng !== 'number') return;
    var color = p.enTurno ? '#00BF00' : '#64748B';
    var m = L.circleMarker([p.lat, p.lng], {
      radius: 11, color: '#FFFFFF', weight: 3, fillColor: color, fillOpacity: 1
    }).addTo(map);
    var el = document.createElement('div');
    el.className = 'pop';
    var b = document.createElement('b'); b.textContent = p.nombre;
    var s = document.createElement('small');
    s.textContent = p.direccion + ' · ' + p.distancia + ' m · ' + (p.enTurno ? 'EN TURNO' : 'SIN TURNO');
    el.appendChild(b); el.appendChild(document.createElement('br')); el.appendChild(s);
    m.bindPopup(el);
    bounds.push([p.lat, p.lng]);
  });

  if (D.yo) {
    L.circleMarker([D.yo.latitude, D.yo.longitude], {
      radius: 9, color: '#FFFFFF', weight: 3, fillColor: D.oscuro ? '#2A9DBF' : '#01475D', fillOpacity: 1
    }).addTo(map).bindPopup('Estás acá');
    bounds.push([D.yo.latitude, D.yo.longitude]);
  }

  if (bounds.length > 1) map.fitBounds(bounds, { padding: [30, 30], maxZoom: 16 });
  else if (bounds.length === 1) map.setView(bounds[0], 15);
</script>
</body></html>`;
}

function MapaFarmaciasBase({ farmacias, ubicacion, height = 220 }: Props) {
  const { colors: Colors, isDark } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const [cargando, setCargando] = useState(true);
  const [fallo, setFallo] = useState(false);

  // Solo se reconstruye el HTML cuando cambian las farmacias o la ubicación
  const html = useMemo(() => construirHtml(farmacias, ubicacion, isDark), [farmacias, ubicacion, isDark]);

  return (
    <View
      style={[styles.contenedor, { height }]}
      accessible
      accessibilityLabel="Mapa con la ubicación de las farmacias. Verde: en turno. Gris: sin turno."
    >
      {fallo ? (
        <View style={styles.centro}>
          <Text style={styles.texto}>No se pudo cargar el mapa. Revisá tu conexión.</Text>
        </View>
      ) : (
        <WebView
          // baseUrl da un "Referer" válido: OpenStreetMap bloquea tiles sin él
          source={{ html, baseUrl: 'https://mapfarma.app' }}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          nestedScrollEnabled // permite arrastrar el mapa dentro de la lista con scroll
          onLoadEnd={() => setCargando(false)}
          onError={() => setFallo(true)}
          onHttpError={() => setFallo(true)}
          style={styles.web}
        />
      )}
      {cargando && !fallo && (
        <View style={[styles.centro, StyleSheet.absoluteFill, styles.cargando]} pointerEvents="none">
          <ActivityIndicator color={Colors.primary} />
        </View>
      )}
    </View>
  );
}

export const MapaFarmacias = memo(MapaFarmaciasBase);

const makeStyles = (Colors: ThemeColors) => StyleSheet.create({
  contenedor: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.cardBg,
    marginBottom: Spacing.md,
  },
  web: { flex: 1, backgroundColor: Colors.cardBg },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  cargando: { backgroundColor: Colors.cardBg },
  texto: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, textAlign: 'center' },
});
