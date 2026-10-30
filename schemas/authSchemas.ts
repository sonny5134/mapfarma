// schemas/authSchemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Ingresá tu email').email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    nombre: z.string().min(2, 'Mínimo 2 caracteres').max(60, 'Demasiado largo'),
    email: z.string().min(1, 'Ingresá tu email').email('Email inválido'),
    telefono: z.string().max(30, 'Demasiado largo').optional().or(z.literal('')),
    password: z
      .string()
      .min(6, 'Mínimo 6 caracteres')
      .regex(/[A-Z]/, 'Necesita una mayúscula')
      .regex(/[0-9]/, 'Necesita un número'),
    confirmar: z.string().min(1, 'Repetí tu contraseña'),
  })
  // Validación cruzada: compara dos campos entre sí antes de enviar
  .refine((data) => data.password === data.confirmar, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmar'],
  });

export type RegisterForm = z.infer<typeof registerSchema>;

export const recuperarSchema = z.object({
  email: z.string().min(1, 'Ingresá tu email').email('Email inválido'),
});

export type RecuperarForm = z.infer<typeof recuperarSchema>;
