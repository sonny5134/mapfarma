// store/auth/auth.types.ts

export type Role = "Customer" | "Pharmacy" | "Developer";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  memberSince: string;
}

// What the mock "database" stores — includes the password, which User does NOT expose
export interface StoredUser extends User {
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

// Custom error so the store/UI can distinguish auth failures from unexpected ones
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}
