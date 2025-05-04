import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().uuid({ message: 'El ID debe ser un UUID válido' }).optional(),
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  code: z.string().min(3, 'El código debe tener al menos 3 caracteres'),
  price: z.number().positive('El precio debe ser un número positivo'),
  status: z.boolean({ required_error: 'El estado debe ser un booleano' }),
  stock: z.number().min(0, 'El stock debe ser un número igual o mayor a 0'),
  category: z.string().min(3, 'La categoría debe tener al menos 3 caracteres'),
  thumbnails: z.array(z.string()).default([]),
});

export const uuidSchema = z.string().uuid({
  message: 'El ID debe ser un UUID válido',
});
