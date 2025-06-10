import { ProductRepository } from '../repositories/index.js';
import { productSchema } from '../dto/product-schema.dto.js';
import mongoose from 'mongoose';

export class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(options = {}) {
    try {
      return await this.productRepository.getAll(options);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID format');
      }
      return await this.productRepository.getById(id);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async createProduct(productData) {
    try {
      const validatedData = productSchema.parse(productData);
      return await this.productRepository.create(validatedData);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async updateProduct(productId, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID format');
      }
      if (updateData.id) {
        throw new Error(`Updating the product ID is not allowed`);
      }
      const validatedData = productSchema.partial().parse(updateData);
      return await this.productRepository.update(productId, validatedData);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID format');
      }
      return await this.productRepository.delete(id);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
}
