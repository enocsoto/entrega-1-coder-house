import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().uuid({ message: 'The ID must be a valid UUID' }).optional(),
  title: z
    .string()
    .min(3, 'The title must have at least 3 characters')
    .transform((val) => val.toLowerCase()),
  description: z
    .string()
    .min(10, 'The description must have at least 10 characters')
    .transform((val) => val.toLowerCase()),
  code: z
    .string()
    .min(3, 'The code must have at least 3 characters')
    .transform((val) => val.toLowerCase()),
  price: z.number().positive('The price must be a positive number'),
  status: z.boolean({ required_error: 'The status must be a boolean' }),
  stock: z.number().min(0, 'The stock must be a number equal to or greater than 0'),
  category: z
    .string()
    .min(3, 'The category must have at least 3 characters')
    .transform((val) => val.toLowerCase()),
  thumbnails: z.array(z.string()).default([]),
});

export const uuidSchema = z.string().uuid({
  message: 'The ID must be a valid UUID',
});
