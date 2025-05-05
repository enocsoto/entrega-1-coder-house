import { uuidSchema } from '../dto/index.js';
import { v4 as uuid } from 'uuid';
import { ProductManager, CartManager } from '../utils/index.js';
class CartService {
  constructor() {
    this.CartManager = new CartManager();
    this.ProductManager = new ProductManager();
  }

  async getCartById(id) {
    try {
      uuidSchema.parse(id);
      const cart = await this.CartManager.getCartById(id);
      const products = [];

      for (const cartProduct of cart.products) {
      const product = await this.ProductManager.getProductById(cartProduct.id);
      if (!product) {
        throw new Error(`Producto con ID ${cartProduct.id} no encontrado`);
      }
      products.push({ ...product, quantity: cartProduct.quantity });
      }

      return { cartId: cart.id, products };
    } catch (error) {
      throw new Error(`Error al obtener el carrito: ${error.message}`);
    }
  }

  async createCart() {
    try {
      const cartId = uuid();
      const newCart = { id: cartId, products: [] };
      return await this.CartManager.addCart(newCart);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Error de validación: ' + error.errors.map((e) => e.message).join(', '));
      } else {
        throw new Error(`Error al crear el carrito: ${error.message}`);
      }
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      uuidSchema.parse(cartId);
      uuidSchema.parse(productId);

      const cart = await this.CartManager.getCartById(cartId);
      const existingProduct = cart.products.find((product) => product.id === productId);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ id: productId, quantity: 1 });
      }

      return await this.CartManager.updateCart(cartId, cart);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error('Error de validación: ' + error.errors.map((e) => e.message).join(', '));
      }
      throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
    }
  }
}

export default CartService;
