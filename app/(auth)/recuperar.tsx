// app/(auth)/recuperar.tsx
import { useMemo, useState } from 'react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import { Spacing, FontSize, Radius, FontFamily, ThemeColors } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { Logo } from '../../components/Logo';
import { authService, mensajeErrorAuth } from '../../services/authService';
import { recuperarSchema, RecuperarForm } from '../../schemas/authSchemas';
import { InputField } from '../../components/ui/InputField';

export default function RecuperarScreen() {
  const { colors: Colors } = useTheme();
  const styles = useMemo(() => makeStyles(Colors), [Colors]);
  const [enviadoA, setEnviadoA] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RecuperarForm>({
    resolver: zodResolver(recuperarSchema),
    defaultValues: { email: '' },
    mode: 'onTouched',
  });

  const onSubmit = async (data: RecuperarForm) => {
    const email = data.email.trim();
    try {
      await authService.sendPasswordReset(email);
      setEnviadoA(email);
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'No se pudo enviar', text2: mensajeErrorAuth(err) });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Logo size={48} style={{ marginRight: Spacing.md }} />
          <View style={styles.headerText}>
            <Text style={styles.appName}>MapFarma</Text>
            <Text style={styles.tagline}>Recuperar contraseña</Text>
          </View>
        </View>

        <View style={styles.form}>
          {enviadoA ? (
            <View accessibilityLiveRegion="polite">
              <Text style={styles.title}>Revisá tu correo</Text>
              <Text style={styles.subtitle}>
                Si {enviadoA} tiene una cuenta en MapFarma, te enviamos un enlace para elegir una
                contraseña nueva. Si no lo ves en unos minutos, mirá la carpeta de spam.
              </Text>
              <Link href="/login" style={styles.volverLink}>
                Volver a iniciar sesión
              </Link>
            </View>
          ) : (
            <>
              <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
              <Text style={styles.subtitle}>
                Ingresá tu email y te enviamos un enlace para crear una contraseña nueva.
              </Text>

              <InputField
                control={control}
                name="email"
                label="Email"
                placeholder="tu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Pressable
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={() => handleSubmit(onSubmit)()}
                disabled={isSubmitting}
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>{isSubmitting ? 'ENVIANDO...' : 'ENVIAR ENLACE'}</Text>
              </Pressable>

              <View style={styles.row}>
                <Link href="/login" style={styles.volverLink}>
                  Volver a iniciar sesión
                </Link>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (Colors: ThemeColors) => StyleSheet.create({
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
  headerText: { flex: 1 },
  appName: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.primary },
  tagline: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, color: Colors.textMuted, marginTop: 2 },

  form: { padding: Spacing.lg },
  title: { fontSize: FontSize.xxl, fontFamily: FontFamily.bold, color: Colors.primary, marginTop: Spacing.md },
  subtitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },

  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  buttonDisabled: { backgroundColor: '#94A3B8' },
  buttonText: { color: Colors.white, fontSize: FontSize.md, fontFamily: FontFamily.bold, letterSpacing: 0.5 },

  row: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  volverLink: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});
