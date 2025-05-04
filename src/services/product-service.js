import {ProductManager} from '../utils/index.js';
import { productSchema, uuidSchema } from '../dto/product-schema.dto.js';
export class ProductService {
  constructor() {
    this.productManager = new ProductManager();
  }

  async getAllProducts() {
    return await this.productManager.getProducts();
  }

  async getProductById(id) {
    uuidSchema.parse(id);
    return await this.productManager.getProductById(id);
  }

  async createProduct(productData) {
    try {
      const validatedData = productSchema.parse(productData);
      return await this.productManager.addProduct(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Error de validación: ` + error.errors.map((e) => e.message).join(', '));
      } else {
        throw new Error(`Error al crear el producto: ${error.message}`);
      }
    }
  }

  async updateProduct(productId, updateData) {
    try {
      const validatedData = productSchema.partial().parse(updateData);
      return await this.productManager.updateProduct(productId, validatedData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw new Error(err.errors.map((e) => e.message).join(', '));
      }
      throw new Error(`Error al actualizar el producto: ${err.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      return await this.productManager.deleteProduct(id);
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  }
}
