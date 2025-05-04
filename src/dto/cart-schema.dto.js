import { productSchema } from './product-schema.dto.js';
import { z } from 'zod';

export const CartSchema = z.object({
  products: z.array(productSchema),
});
