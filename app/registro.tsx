// app/registro.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Radius, FontFamily } from '../constants/theme';

export default function RegistroScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleCrearCuenta = () => {
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setError('Completá nombre, email y contraseña.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña tiene que tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    // TODO: acá va la llamada real a tu backend/auth para crear el usuario.
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
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
          <Text style={styles.label}>NOMBRE COMPLETO</Text>
          <TextInput
            style={styles.input}
            placeholder="Juan García"
            placeholderTextColor={Colors.textMuted}
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            placeholderTextColor={Colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>TELÉFONO</Text>
          <TextInput
            style={styles.input}
            placeholder="011 1234-5678"
            placeholderTextColor={Colors.textMuted}
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>CONTRASEÑA</Text>
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={Colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>CONFIRMAR CONTRASEÑA</Text>
          <TextInput
            style={styles.input}
            placeholder="Repetí tu contraseña"
            placeholderTextColor={Colors.textMuted}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable style={styles.submitButton} onPress={handleCrearCuenta}>
            <Text style={styles.submitButtonText}>CREAR CUENTA</Text>
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
  backLink: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
    marginBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: Radius.lg,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
  },
  tagline: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: 2,
  },

  form: {
    padding: Spacing.lg,
  },
  label: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
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

  errorText: {
    color: Colors.danger,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    marginTop: Spacing.md,
  },

  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    letterSpacing: 0.5,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  loginText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  loginLink: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});
