// app/(tabs)/publicar.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, FontSize, Radius, FontFamily } from '../../constants/theme';
import { useUser } from '../../contexts/UserContext';
import { CategoriaMedicamento } from '../../types';

const categorias: CategoriaMedicamento[] = ['Analgésicos', 'Antibióticos', 'Antialérgicos', 'Gastro', 'Otros'];

export default function PublicarScreen() {
  const { agregarProducto } = useUser();

  const [imagenUri, setImagenUri] = useState<string | undefined>(undefined);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState<CategoriaMedicamento>('Analgésicos');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [requiereReceta, setRequiereReceta] = useState(false);

  const elegirImagen = async (fuente: 'camara' | 'galeria') => {
    const permiso =
      fuente === 'camara'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert('Permiso necesario', 'Necesitamos acceso para agregar la foto del producto.');
      return;
    }

    const resultado =
      fuente === 'camara'
        ? await ImagePicker.launchCameraAsync({ quality: 0.6, allowsEditing: true })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.6, allowsEditing: true });

    if (!resultado.canceled && resultado.assets[0]) {
      setImagenUri(resultado.assets[0].uri);
    }
  };

  const handleFotoPress = () => {
    Alert.alert('Foto del producto', '¿Cómo querés agregarla?', [
      { text: 'Usar cámara', onPress: () => elegirImagen('camara') },
      { text: 'Galería', onPress: () => elegirImagen('galeria') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const resetForm = () => {
    setImagenUri(undefined);
    setNombre('');
    setCategoria('Analgésicos');
    setPrecio('');
    setStock('');
    setDescripcion('');
    setRequiereReceta(false);
  };

  const handlePublicar = () => {
    const precioNum = Number(precio);
    const stockNum = Number(stock);

    if (!nombre.trim() || !precio.trim() || !stock.trim()) {
      Alert.alert('Faltan datos', 'Completá al menos nombre, precio y stock.');
      return;
    }
    if (Number.isNaN(precioNum) || precioNum <= 0) {
      Alert.alert('Precio inválido', 'Ingresá un precio válido en ARS.');
      return;
    }
    if (Number.isNaN(stockNum) || stockNum < 0) {
      Alert.alert('Stock inválido', 'Ingresá una cantidad de stock válida.');
      return;
    }

    agregarProducto({
      nombre: nombre.trim(),
      categoria,
      precio: precioNum,
      stock: stockNum,
      descripcion: descripcion.trim(),
      requiereReceta,
      imagenUri,
    });

    resetForm();
    Alert.alert('¡Publicado!', 'Tu medicamento ya aparece en "Mis productos".', [
      { text: 'OK', onPress: () => router.push('/(tabs)/perfil') },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Agregar medicamento</Text>
      <Text style={styles.subtitle}>Publicá un producto en el catálogo.</Text>

      <Text style={styles.label}>FOTO DEL PRODUCTO</Text>
      <Pressable style={styles.photoBox} onPress={handleFotoPress}>
        {imagenUri ? (
          <Image source={{ uri: imagenUri }} style={styles.photoPreview} />
        ) : (
          <>
            <View style={styles.cameraIconCircle}>
              <Ionicons name="camera" size={22} color={Colors.primary} />
            </View>
            <View style={styles.photoButtonsRow}>
              <View style={styles.photoButtonPrimary}>
                <Text style={styles.photoButtonPrimaryText}>📷 Usar cámara</Text>
              </View>
              <View style={styles.photoButtonSecondary}>
                <Text style={styles.photoButtonSecondaryText}>Galería</Text>
              </View>
            </View>
          </>
        )}
      </Pressable>

      <Text style={styles.label}>NOMBRE DEL MEDICAMENTO</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Ibuprofeno 400mg"
        placeholderTextColor={Colors.textMuted}
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>CATEGORÍA</Text>
      <View style={styles.categoryRow}>
        {categorias.map((c) => (
          <Pressable
            key={c}
            style={[styles.categoryPill, categoria === c && styles.categoryPillActive]}
            onPress={() => setCategoria(c)}
          >
            <Text style={[styles.categoryPillText, categoria === c && styles.categoryPillTextActive]}>
              {c}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>PRECIO (ARS)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 1850"
        placeholderTextColor={Colors.textMuted}
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />

      <Text style={styles.label}>STOCK (UNIDADES)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 30"
        placeholderTextColor={Colors.textMuted}
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />

      <Text style={styles.label}>DESCRIPCIÓN</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Indicaciones, presentación, laboratorio..."
        placeholderTextColor={Colors.textMuted}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        numberOfLines={4}
      />

      <Pressable style={styles.checkboxRow} onPress={() => setRequiereReceta((v) => !v)}>
        <View style={[styles.checkbox, requiereReceta && styles.checkboxActive]}>
          {requiereReceta && <Ionicons name="checkmark" size={14} color={Colors.white} />}
        </View>
        <Text style={styles.checkboxLabel}>Requiere receta médica</Text>
      </Pressable>

      <Pressable style={styles.submitButton} onPress={handlePublicar}>
        <Text style={styles.submitButtonText}>PUBLICAR MEDICAMENTO</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.xxl },

  title: { fontSize: FontSize.xxl, fontFamily: FontFamily.bold, color: Colors.primary, marginTop: Spacing.md },
  subtitle: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: Spacing.xs, marginBottom: Spacing.lg },

  label: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },

  photoBox: {
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    borderStyle: 'dashed',
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  photoPreview: { width: '100%', height: 160, borderRadius: Radius.sm },
  cameraIconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  photoButtonsRow: { flexDirection: 'row' },
  photoButtonPrimary: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    marginRight: Spacing.sm,
  },
  photoButtonPrimaryText: { color: Colors.white, fontSize: FontSize.sm, fontFamily: FontFamily.bold },
  photoButtonSecondary: {
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
  },
  photoButtonSecondaryText: { color: Colors.text, fontSize: FontSize.sm, fontFamily: FontFamily.bold },

  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },

  categoryRow: { flexDirection: 'row', flexWrap: 'wrap' },
  categoryPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  categoryPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryPillText: { fontSize: FontSize.sm, fontFamily: FontFamily.bold, color: Colors.textMuted },
  categoryPillTextActive: { color: Colors.white },

  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.lg },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  checkboxActive: { backgroundColor: Colors.danger, borderColor: Colors.danger },
  checkboxLabel: { fontSize: FontSize.md, fontFamily: FontFamily.regular, color: Colors.text },

  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  submitButtonText: { color: Colors.white, fontSize: FontSize.md, fontFamily: FontFamily.bold, letterSpacing: 0.5 },
});
