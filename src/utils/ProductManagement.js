import fs from 'fs';
import path from 'path';

class ProductManager {
  constructor() {
    // Ruta absoluta al archivo JSON de productos
    this.filePath = path.resolve('src/config/products.json');
    this.products = [];
  }

  // Carga los productos desde el archivo JSON a memoria
  async loadProducts() {
    try {
      const fileData = await fs.promises.readFile(this.filePath, 'utf-8');
      this.products = JSON.parse(fileData);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.products = [];
        await fs.promises.writeFile(this.filePath, JSON.stringify([], null, 2));
      } else {
        throw error;
      }
    }
  }

  // Guarda el arreglo de productos en el archivo JSON
  async saveProducts() {
    await fs.promises.writeFile(this.filePath, JSON.stringify(this.products, null, 2));
  }

  // Devuelve todos los productos
  async getProducts() {
    await this.loadProducts();
    return this.products;
  }

  // Agrega un producto y lo guarda en el archivo
  async addProduct(productData) {
    await this.loadProducts();
    const { title, description, price, thumbnail, code, stock, status = true } = productData;
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error('All fields are required');
    }
    if (this.products.some(product => product.code === code)) {
      throw new Error('Product code must be unique');
    }
    const newId = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
    const newProduct = {
      id: newId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status
    };
    this.products.push(newProduct);
    await this.saveProducts();
    return newProduct;
  }

  // Busca un producto por ID
  async getProductById(id) {
    await this.loadProducts();
    const product = this.products.find(p => p.id === id);
    return product || null;
  }
}

export default ProductManager;

