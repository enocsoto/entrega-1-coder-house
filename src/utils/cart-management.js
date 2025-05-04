import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { v4 as uuid } from 'uuid';

class CartManager {
  constructor() {
    this.filePath = path.resolve(process.env.CART_PATH);
    this.carts = [];
  }

  async loadCarts() {
    try {
      const fileData = await fs.promises.readFile(this.filePath, 'utf-8');
      this.carts = JSON.parse(fileData);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.carts = [];
        await fs.promises.writeFile(this.filePath, JSON.stringify([], null, 2));
      } else {
        throw new Error(`Error loading carts: ${error.message}`);
      }
    }
  }

  async saveCarts() {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.error(`Error saving carts: ${error.message}`);
      throw error;
    }
  }

  async getCarts() {
    try {
      await this.loadCarts();
      return this.carts;
    } catch (error) {
      throw new Error(`Error loading carts: ${error.message}`);
    }
  }

  async addCart(cartData) {
    try {
      await this.loadCarts();
      const newId = uuid();
      const newCart = { ...cartData, id: newId };
      this.carts.push(newCart);
      await this.saveCarts();
      return newCart;
    } catch (error) {
      throw new Error(`Error adding cart: ${error.message}`);
    }
  }

  async getCartById(cartId) {
    try {
      await this.loadCarts();
      const cart = this.carts.find((cart) => cart.id === cartId);
      if (!cart) {
        throw new Error(`Cart not found`);
      }
      return cart;
    } catch (error) {
      throw new Error(`Error getting cart by ID: ${error.message}`);
    }
  }

  async updateCart(cartId, cartData) {
    try {
      await this.loadCarts();
      const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);
      if (cartIndex === -1) return null;
      const updatedCart = { ...this.carts[cartIndex], ...cartData };
      this.carts[cartIndex] = updatedCart;
      await this.saveCarts();
      return updatedCart;
    } catch (error) {
      throw new Error(`Error updating cart: ${error.message}`);
    }
  }

  async deleteCart(cartId) {
    try {
      await this.loadCarts();
      const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);
      if (cartIndex === -1) return null;
      this.carts.splice(cartIndex, 1);
      await this.saveCarts();
      return;
    } catch (error) {
      throw new Error(`Error deleting cart: ${error.message}`);
    }
  }
}

export { CartManager };
