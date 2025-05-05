import { ProductManager } from '../utils/index.js';
import { productSchema, uuidSchema } from '../dto/product-schema.dto.js';
export class ProductService {
  constructor() {
    this.productManager = new ProductManager();
  }

  async getAllProducts() {
    try {
      return await this.productManager.getProducts();
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      uuidSchema.parse(id);
      return await this.productManager.getProductById(id);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async createProduct(productData) {
    try {
      const validatedData = productSchema.parse(productData);
      if (validatedData.code) {
        const products = await this.productManager.getProducts();
        if (products.some((product) => product.code === validatedData.code)) {
          throw new Error(`The product code already exists`);
        }
      }
      return await this.productManager.addProduct(validatedData);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async updateProduct(productId, updateData) {
    try {
      if (updateData.id) {
        throw new Error(`Updating the product ID is not allowed`);
      }
      const validatedData = productSchema.partial().parse(updateData);
      return await this.productManager.updateProduct(productId, validatedData);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      return await this.productManager.deleteProduct(id);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
}
