import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidV4 } from 'uuid';
import ProductManager from '../utils/ProductManagement.js';

export class ProductService {
  constructor() {
    this.productManager = new ProductManager();
  }

  async getAllProducts() {
    return await this.productManager.getProducts();
  }

  async getProductById(id) {
    if (!id || isNaN(Number(id))) {
      throw new Error('ID inválido');
    }
    return await this.productManager.getProductById(Number(id));
  }

  async createProduct(productData) {
    // Validaciones básicas
    const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        throw new Error(`El campo '${field}' es obligatorio`);
      }
    }
    if (typeof productData.description !== 'string' || productData.description.length < 10) {
      throw new Error('La descripción debe tener al menos 10 caracteres');
    }
    if (isNaN(Number(productData.price)) || Number(productData.price) <= 0) {
      throw new Error('El precio debe ser un número positivo');
    }
    if (isNaN(Number(productData.stock)) || Number(productData.stock) < 0) {
      throw new Error('El stock debe ser un número igual o mayor a 0');
    }
    // Validación de unicidad de código
    const productos = await this.productManager.getProducts();
    if (productos.some(p => p.code === productData.code)) {
      throw new Error('El código del producto ya existe');
    }
    return await this.productManager.addProduct(productData);
  }

  async updateProduct(id, updatedData) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      return null;
    }
    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updatedData
    };
    const filePath = path.join(__dirname, '../../config', 'products.json');
    await fs.writeFile(filePath, JSON.stringify(this.products, null, 2));
    return this.products[productIndex];
  }

  async deleteProduct(id) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      return null;
    }
    const deletedProduct = this.products.splice(productIndex, 1);
    const filePath = path.join(__dirname, '../../config', 'products.json');
    await fs.writeFile(filePath, JSON.stringify(this.products, null, 2));
    return deletedProduct[0];
  }
}
