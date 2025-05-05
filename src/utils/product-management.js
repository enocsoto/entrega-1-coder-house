import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { v4 as uuid } from 'uuid';

class ProductManager {
  constructor() {
    this.filePath = path.resolve(process.env.PRODUCT_PATH);
    this.products = [];
  }

  async loadProducts() {
    try {
      const fileData = await fs.promises.readFile(this.filePath, 'utf-8');
      this.products = JSON.parse(fileData);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.products = [];
        await fs.promises.writeFile(this.filePath, JSON.stringify([], null, 2));
      } else {
        throw new Error(`Error loading products: ${error.message}`);
      }
    }
  }

  async saveProducts() {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(this.products, null, 2));
    } catch (error) {
      throw new Error(`Error saving products: ${error.message}`);
    }
  }

  async getProducts() {
    try {
      await this.loadProducts();
      return this.products;
    } catch (error) {
      throw new Error(`Error getting products: ${error.message}`);
    }
  }

  async addProduct(productData) {
    try {
      await this.loadProducts();
      const newId = uuid();
      const newProduct = { ...productData, id: newId };
      this.products.push(newProduct);
      await this.saveProducts();
      return newProduct;
    } catch (error) {
      throw new Error(`Error adding product: ${error.message}`);
    }
  }

  async getProductById(productId) {
    try {
      await this.loadProducts();
      const product = this.products.find((product) => product.id === productId);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw new Error(`Error getting product: ${error.message}`);
    }
  }

  async updateProduct(productId, updatedData) {
    try {
      await this.loadProducts();
      const productIndex = this.products.findIndex((product) => product.id === productId);
      if (productIndex === -1) return null;
      const updatedProduct = { ...this.products[productIndex], ...updatedData };
      this.products[productIndex] = updatedProduct;
      await this.saveProducts();
      return updatedProduct;
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  async deleteProduct(productId) {
    try {
      await this.loadProducts();
      const productIndex = this.products.findIndex((p) => p.id === productId);
      if (productIndex === -1) {
        throw new Error('Product not found');
      }
      this.products.splice(productIndex, 1)[0];
      await this.saveProducts();
      return true;
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }
}

export { ProductManager };
