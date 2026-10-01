// app/editar/[id].tsx
import { useEffect } from 'react';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardAvoidingView, ScrollView, Platform, Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { Colors, Spacing, FontSize, Radius, FontFamily } from '../../constants/theme';
import { InputField } from '../../components/ui/InputField';
import { medicamentoSchema, MedicamentoForm } from '../../schemas/medicamentoSchema';
import { medicamentosService } from '../../services/firestoreMedicamentos';
import { useMedicamento } from '../../hooks/useMedicamento';

export default function EditarMedicamentoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { medicamento, cargando } = useMedicamento(id);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
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
  });

  // Rellenar el formulario recién cuando llega el medicamento desde Firestore
  useEffect(() => {
    if (medicamento) {
      reset({
        nombre: medicamento.nombre,
        categoria: medicamento.categoria,
        precio: medicamento.precio,
        stock: medicamento.stock,
        descripcion: medicamento.descripcion,
        requiereReceta: medicamento.requiereReceta,
      });
    }
  }, [medicamento, reset]);

  const onSubmit = async (data: MedicamentoForm) => {
    try {
      await medicamentosService.update(id, data);
      Toast.show({ type: 'success', text1: '¡Actualizado!' });
      router.back();
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: err.message });
    }
  };

  if (cargando) {
    return (
      <>
        <Stack.Screen options={{ title: 'Editar' }} />
        <ActivityIndicator style={styles.loader} size="large" color={Colors.primary} />
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Editar producto',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
        }}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <InputField control={control} name="nombre" label="Nombre del medicamento" />
          <InputField control={control} name="precio" label="Precio (ARS)" keyboardType="numeric" />
          <InputField control={control} name="stock" label="Stock (unidades)" keyboardType="numeric" />
          <InputField control={control} name="descripcion" label="Descripción" multiline />

          <Pressable
            style={[styles.submitButton, (isSubmitting || !isDirty) && styles.submitButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting || !isDirty} // solo habilitado si hubo cambios reales
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  loader: { flex: 1, justifyContent: 'center', backgroundColor: Colors.background },

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
