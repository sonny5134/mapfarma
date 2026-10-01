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
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import { Colors, Spacing, FontSize, Radius, FontFamily } from '../../constants/theme';
import { useUser } from '../../contexts/UserContext';
import { medicamentosService } from '../../services/firestoreMedicamentos';
import { medicamentoSchema, MedicamentoForm } from '../../schemas/medicamentoSchema';
import { InputField } from '../../components/ui/InputField';
import { CategoriaMedicamento } from '../../types';

const categorias: CategoriaMedicamento[] = ['Analgésicos', 'Antibióticos', 'Antialérgicos', 'Gastro', 'Otros'];

export default function PublicarScreen() {
  const { usuario } = useUser();
  const [imagenUri, setImagenUri] = useState<string | undefined>(undefined);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm<MedicamentoForm>({
    resolver: zodResolver(medicamentoSchema),
    defaultValues: {
      nombre: '',
      categoria: 'Analgésicos',
      precio: 0,
      stock: 0,
      descripcion: '',
      requiereReceta: false,
    },
    mode: 'onTouched', // valida cuando el campo pierde el foco
  });

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

  const onSubmit = async (data: MedicamentoForm) => {
    try {
      await medicamentosService.create({
        ...data,
        farmaciaId: 'propio',
        imagenUrl: imagenUri,
        publicadoPor: usuario?.email,
      } as any);
      Toast.show({ type: 'success', text1: '¡Publicado!', text2: 'Ya aparece en Mis productos.' });
      reset();
      setImagenUri(undefined);
      router.push('/(tabs)/perfil');
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Error al guardar', text2: err.message });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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

        <InputField control={control} name="nombre" label="Nombre del medicamento" placeholder="Ej: Ibuprofeno 400mg" />

        {/* Categoría: control manual con Controller (no es un TextInput simple) */}
        <Controller
          control={control}
          name="categoria"
          render={({ field: { onChange, value } }) => (
            <View style={styles.wrapper}>
              <Text style={styles.label}>CATEGORÍA</Text>
              <View style={styles.categoryRow}>
                {categorias.map((c) => (
                  <Pressable
                    key={c}
                    style={[styles.categoryPill, value === c && styles.categoryPillActive]}
                    onPress={() => onChange(c)}
                  >
                    <Text style={[styles.categoryPillText, value === c && styles.categoryPillTextActive]}>
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        />

        <InputField control={control} name="precio" label="Precio (ARS)" placeholder="Ej: 1850" keyboardType="numeric" />
        <InputField control={control} name="stock" label="Stock (unidades)" placeholder="Ej: 30" keyboardType="numeric" />
        <InputField
          control={control}
          name="descripcion"
          label="Descripción"
          placeholder="Indicaciones, presentación, laboratorio..."
          multiline
        />

        {/* Checkbox: también con Controller manual */}
        <Controller
          control={control}
          name="requiereReceta"
          render={({ field: { onChange, value } }) => (
            <Pressable style={styles.checkboxRow} onPress={() => onChange(!value)}>
              <View style={[styles.checkbox, value && styles.checkboxActive]}>
                {value && <Ionicons name="checkmark" size={14} color={Colors.white} />}
              </View>
              <Text style={styles.checkboxLabel}>Requiere receta médica</Text>
            </Pressable>
          )}
        />

        <Pressable
          style={[styles.submitButton, (isSubmitting || !isValid) && styles.submitButtonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting || !isValid}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'GUARDANDO...' : 'PUBLICAR MEDICAMENTO'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
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
  },
  wrapper: { marginBottom: Spacing.md },

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
    marginBottom: Spacing.md,
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

  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm, marginBottom: Spacing.lg },
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
    marginTop: Spacing.md,
  },
  submitButtonDisabled: { backgroundColor: '#94A3B8' },
  submitButtonText: { color: Colors.white, fontSize: FontSize.md, fontFamily: FontFamily.bold, letterSpacing: 0.5 },
});
