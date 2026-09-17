// store/auth/authStore.ts
import { create } from "zustand";
import { User, LoginCredentials, RegisterInput, AuthError } from "./auth.types";
import { authService } from "./authService";

type AuthStatus = "idle" | "loading" | "error";

interface AuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (input: RegisterInput) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "idle",
  error: null,

  login: async (credentials) => {
    set({ status: "loading", error: null });
    try {
      const user = await authService.login(credentials);
      set({ user, status: "idle", error: null });
      return true;
    } catch (err) {
      const message =
        err instanceof AuthError ? err.message : "Ocurrió un error inesperado.";
      set({ status: "error", error: message });
      return false;
    }
  },

  register: async (input) => {
    set({ status: "loading", error: null });
    try {
      const user = await authService.register(input);
      set({ user, status: "idle", error: null });
      return true;
    } catch (err) {
      const message =
        err instanceof AuthError ? err.message : "Ocurrió un error inesperado.";
      set({ status: "error", error: message });
      return false;
    }
  },

  logout: () => set({ user: null, status: "idle", error: null }),

  clearError: () => set({ error: null }),
}));
