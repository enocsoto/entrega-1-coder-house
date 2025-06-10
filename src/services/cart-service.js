import { CartRepository, ProductRepository } from '../repositories/index.js';
import mongoose from 'mongoose';

export class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
  }

  async getCartById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid cart ID format');
      }
      const cart = await this.cartRepository.getById(id);
      return cart;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async createCart(products) {
    try {
      // pasar los id de productos al carrito
      if (!Array.isArray(products)) {
        throw new Error('Products must be an array');
      }
      const cart =[];
      for (const item of products) {
        if (!item.id || !mongoose.Types.ObjectId.isValid(item.id)) {
          throw new Error('Invalid product ID format in products array');
        }
         cart.push(await this.cartRepository.create(item.id));
      }

      if (!cart) {
        throw new Error('Failed to create cart');
      }
      return cart;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new Error('Invalid cart ID format');
      }
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID format');
      }

      // Verify product exists
      const product = await this.productRepository.getById(productId);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      return await this.cartRepository.addProduct(cartId, productId, quantity);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new Error('Invalid cart ID format');
      }
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID format');
      }
      if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      return await this.cartRepository.updateProductQuantity(cartId, productId, quantity);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async updateCart(cartId, products) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new Error('Invalid cart ID format');
      }

      // Validar que todos los productos tengan un ID válido
      if (!Array.isArray(products)) {
        throw new Error('Products must be an array');
      }

      for (const item of products) {
        if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
          throw new Error('Invalid product ID format in products array');
        }
        if (!item.quantity || item.quantity <= 0) {
          throw new Error('Quantity must be greater than 0 for all products');
        }

        // Verificar que el producto existe
        await this.productRepository.getById(item.product);
      }

      return await this.cartRepository.updateCart(cartId, products);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new Error('Invalid cart ID format');
      }
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID format');
      }

      return await this.cartRepository.removeProduct(cartId, productId);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async clearCart(cartId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new Error('Invalid cart ID format');
      }

      return await this.cartRepository.clearCart(cartId);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
}
