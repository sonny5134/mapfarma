// app/login.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Spacing,
  FontSize,
  Radius,
  FontFamily,
} from "../../constants/theme";
import { useAuthStore } from "../../store/auth/authStore";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((s) => s.login);
  const status = useAuthStore((s) => s.status);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const isLoading = status === "loading";

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;

    const success = await login({
      email: email.trim(),
      password: password.trim(),
    });
    if (success) {
      router.replace("/(tabs)");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Ionicons name="heart" size={22} color={Colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.appName}>MapFarma</Text>
            <Text style={styles.tagline}>
              Farmacias de turno en tiempo real · Pilar
            </Text>
          </View>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.subtitle}>
            Accedé a tu cuenta para encargar medicamentos.
          </Text>

          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            placeholderTextColor={Colors.textMuted}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) clearError();
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />

          <Text style={styles.label}>CONTRASEÑA</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) clearError();
              }}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <Pressable
              onPress={() => setShowPassword((v) => !v)}
              disabled={isLoading}
            >
              <Text style={styles.showToggle}>
                {showPassword ? "Ocultar" : "Ver"}
              </Text>
            </Pressable>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.loginButtonText}>INGRESAR</Text>
            )}
          </Pressable>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>¿No tenés cuenta? </Text>
            <Link href="/registro" style={styles.signupLink}>
              Crear cuenta
            </Link>
          </View>

          <View style={styles.demoBox}>
            <Text style={styles.demoIcon}>💡</Text>
            <Text style={styles.demoText}>
              Demo: juan@mapfarma.com / maria@mapfarma.com, contraseña 123456.
            </Text>
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
    flexDirection: "row",
    alignItems: "center",
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  headerText: { flex: 1 },
  appName: {
    fontSize: FontSize.xl,
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
  title: {
    fontSize: FontSize.xxxl,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
    marginTop: Spacing.md,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
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

  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: Spacing.sm + 4,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: Colors.text,
  },
  showToggle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: Colors.secondary,
  },

  errorText: {
    color: Colors.danger,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    marginTop: Spacing.md,
  },

  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    letterSpacing: 0.5,
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.lg,
  },
  signupText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  signupLink: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: Colors.primary,
    textDecorationLine: "underline",
  },

  demoBox: {
    flexDirection: "row",
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.xl,
    alignItems: "flex-start",
  },
  demoIcon: {
    fontSize: FontSize.lg,
    marginRight: Spacing.sm,
  },
  demoText: {
    flex: 1,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.primary,
  },
});
