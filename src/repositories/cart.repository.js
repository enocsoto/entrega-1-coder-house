import { Cart } from '../models/index.js';

export class CartRepository {
  async getAll() {
    try {
      return await Cart.find();
    } catch (error) {
      throw new Error(`Error getting carts: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const cart = await Cart.findById(id).populate('products.product');
      if (!cart) {
        throw new Error('Cart not found');
      }
      return cart;
    } catch (error) {
      throw new Error(`Error getting cart: ${error.message}`);
    }
  }

  async create(itemId) {
    try {
      const newCart = new Cart({ products: [{ product: itemId }] });
      return await newCart.save();
    } catch (error) {
      throw new Error(`Error creating cart: ${error.message}`);
    }
  }

  async addProduct(cartId, productId, quantity = 1) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      // Check if product already exists in cart
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex !== -1) {
        // Product exists, update quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // Product doesn't exist, add it
        cart.products.push({ product: productId, quantity });
      }

      return await cart.save();
    } catch (error) {
      throw new Error(`Error adding product to cart: ${error.message}`);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex === -1) {
        throw new Error('Product not found in cart');
      }

      cart.products[productIndex].quantity = quantity;
      return await cart.save();
    } catch (error) {
      throw new Error(`Error updating product quantity: ${error.message}`);
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      // Validar que todos los productos tengan un ID y una cantidad válida
      if (!Array.isArray(products)) {
        throw new Error('Products must be an array');
      }

      // Actualizar los productos del carrito
      cart.products = products;
      return await cart.save();
    } catch (error) {
      throw new Error(`Error updating cart: ${error.message}`);
    }
  }

  async removeProduct(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      cart.products = cart.products.filter(
        (item) => item.product.toString() !== productId
      );

      return await cart.save();
    } catch (error) {
      throw new Error(`Error removing product from cart: ${error.message}`);
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      cart.products = [];
      return await cart.save();
    } catch (error) {
      throw new Error(`Error clearing cart: ${error.message}`);
    }
  }
}