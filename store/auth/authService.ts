// store/auth/authService.ts
import {
  StoredUser,
  User,
  LoginCredentials,
  RegisterInput,
  AuthError,
} from "./auth.types";

let mockUsers: StoredUser[] = [
  {
    id: "user-1",
    name: "Juan García",
    email: "juan@mapfarma.com",
    phone: "011 1234-5678",
    role: "Customer",
    memberSince: "enero 2025",
    password: "123456",
  },
  {
    id: "user-2",
    name: "María López",
    email: "maria@mapfarma.com",
    role: "Pharmacy",
    memberSince: "marzo 2025",
    password: "123456",
  },
];

const SIMULATED_DELAY_MS = 700;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toPublicUser(stored: StoredUser): User {
  const { password, ...publicUser } = stored;
  return publicUser;
}

function currentMonthYear(): string {
  return new Date().toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
}

export const authService = {
  async login({ email, password }: LoginCredentials): Promise<User> {
    await delay(SIMULATED_DELAY_MS);

    const normalizedEmail = email.trim().toLowerCase();
    const found = mockUsers.find(
      (u) => u.email.toLowerCase() === normalizedEmail,
    );

    if (!found) {
      throw new AuthError("No existe una cuenta con ese email.");
    }
    if (found.password !== password) {
      throw new AuthError("La contraseña es incorrecta.");
    }

    return toPublicUser(found);
  },

  async register(input: RegisterInput): Promise<User> {
    await delay(SIMULATED_DELAY_MS);

    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();
    const phone = input.phone?.trim();

    if (!name || !email || !input.password) {
      throw new AuthError("Completá nombre, email y contraseña.");
    }
    if (input.password.length < 6) {
      throw new AuthError(
        "La contraseña tiene que tener al menos 6 caracteres.",
      );
    }
    if (input.password !== input.confirmPassword) {
      throw new AuthError("Las contraseñas no coinciden.");
    }

    const alreadyExists = mockUsers.some(
      (u) => u.email.toLowerCase() === email,
    );
    if (alreadyExists) {
      throw new AuthError("Ya existe una cuenta registrada con ese email.");
    }

    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone: phone || undefined,
      role: "Customer",
      memberSince: currentMonthYear(),
      password: input.password,
    };

    mockUsers = [...mockUsers, newUser];

    return toPublicUser(newUser);
  },
};
