// app/(auth)/registro.tsx
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import { Colors, Spacing, FontSize, Radius, FontFamily } from '../../constants/theme';
import { useUser } from '../../contexts/UserContext';
import { mensajeErrorAuth } from '../../services/authService';
import { registerSchema, RegisterForm } from '../../schemas/authSchemas';
import { InputField } from '../../components/ui/InputField';

export default function RegistroScreen() {
  const { registrar } = useUser();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nombre: '', email: '', telefono: '', password: '', confirmar: '' },
    mode: 'onTouched',
  });

  // Al crear la cuenta Firebase abre la sesión solo, y el Auth Guard nos lleva a los tabs.
  const onSubmit = async (data: RegisterForm) => {
    try {
      await registrar({
        nombre: data.nombre.trim(),
        email: data.email.trim(),
        telefono: data.telefono?.trim(),
        password: data.password,
      });
      Toast.show({ type: 'success', text1: '¡Cuenta creada!', text2: 'Ya podés usar MapFarma.' });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'No pudimos crear la cuenta', text2: mensajeErrorAuth(err) });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backLink}>← Volver</Text>
          </Pressable>

          <View style={styles.headerRow}>
            <View style={styles.logoBox}>
              <Ionicons name="heart" size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.title}>Crear cuenta</Text>
              <Text style={styles.tagline}>Pilar, Buenos Aires</Text>
            </View>
          </View>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <InputField control={control} name="nombre" label="Nombre completo" placeholder="Juan García" />
          <InputField
            control={control}
            name="email"
            label="Email"
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            control={control}
            name="telefono"
            label="Teléfono"
            placeholder="011 1234-5678"
            keyboardType="phone-pad"
          />
          <InputField
            control={control}
            name="password"
            label="Contraseña"
            placeholder="Mínimo 6 caracteres, una mayúscula y un número"
            secureTextEntry
            autoCapitalize="none"
          />
          <InputField
            control={control}
            name="confirmar"
            label="Confirmar contraseña"
            placeholder="Repetí tu contraseña"
            secureTextEntry
            autoCapitalize="none"
          />

          <Pressable
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
            </Text>
          </Pressable>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>¿Ya tenés cuenta? </Text>
            <Link href="/login" style={styles.loginLink}>
              Iniciar sesión
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1 },

  header: {
    backgroundColor: Colors.cardBg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  backLink: { fontSize: FontSize.md, fontFamily: FontFamily.bold, color: Colors.primary, marginBottom: Spacing.lg },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: Radius.lg,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  title: { fontSize: FontSize.xxl, fontFamily: FontFamily.bold, color: Colors.primary },
  tagline: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },

  form: { padding: Spacing.lg },

  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  submitButtonDisabled: { backgroundColor: '#94A3B8' },
  submitButtonText: { color: Colors.white, fontSize: FontSize.md, fontFamily: FontFamily.bold, letterSpacing: 0.5 },

  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  loginText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted },
  loginLink: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});
