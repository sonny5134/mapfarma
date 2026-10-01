// schemas/medicamentoSchema.ts
import { z } from 'zod';

export const medicamentoSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Demasiado largo'),
  categoria: z.string().min(1, 'Seleccioná una categoría'),
  // z.coerce.number() es FUNDAMENTAL: el TextInput siempre devuelve un string,
  // aunque el teclado sea numérico.
  precio: z.coerce.number().positive('El precio tiene que ser mayor a 0'),
  stock: z.coerce
    .number()
    .int('Tiene que ser un número entero')
    .min(0, 'El stock no puede ser negativo'),
  descripcion: z.string().max(300, 'Máximo 300 caracteres').optional().or(z.literal('')),
  requiereReceta: z.boolean().default(false),
});

// Extraemos el tipo de TypeScript automáticamente para no duplicar código
export type MedicamentoForm = z.infer<typeof medicamentoSchema>;
