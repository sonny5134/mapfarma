// app/(auth)/login.tsx
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import { Colors, Spacing, FontSize, Radius, FontFamily } from '../../constants/theme';
import { useUser } from '../../contexts/UserContext';
import { mensajeErrorAuth } from '../../services/authService';
import { loginSchema, LoginForm } from '../../schemas/authSchemas';
import { InputField } from '../../components/ui/InputField';

export default function LoginScreen() {
  const { login } = useUser();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  // No hace falta navegar a mano: apenas la sesión queda activa, el Auth Guard
  // de app/_layout.tsx nos manda a los tabs con router.replace (sin botón "Atrás" al login).
  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email.trim(), data.password);
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Error al ingresar', text2: mensajeErrorAuth(err) });
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
          <View style={styles.logoBox}>
            <Ionicons name="heart" size={22} color={Colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.appName}>MapFarma</Text>
            <Text style={styles.tagline}>Farmacias de turno en tiempo real · Pilar</Text>
          </View>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.subtitle}>Accedé a tu cuenta para encargar medicamentos.</Text>

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
            name="password"
            label="Contraseña"
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
          />

          <Pressable
            style={[styles.loginButton, isSubmitting && styles.loginButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text style={styles.loginButtonText}>{isSubmitting ? 'INGRESANDO...' : 'INGRESAR'}</Text>
          </Pressable>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>¿No tenés cuenta? </Text>
            <Link href="/registro" style={styles.signupLink}>
              Crear cuenta
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
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerText: { flex: 1 },
  appName: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.primary },
  tagline: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },

  form: { padding: Spacing.lg },
  title: { fontSize: FontSize.xxxl, fontFamily: FontFamily.bold, color: Colors.primary, marginTop: Spacing.md },
  subtitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },

  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  loginButtonDisabled: { backgroundColor: '#94A3B8' },
  loginButtonText: { color: Colors.white, fontSize: FontSize.md, fontFamily: FontFamily.bold, letterSpacing: 0.5 },

  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  signupText: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted },
  signupLink: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});
