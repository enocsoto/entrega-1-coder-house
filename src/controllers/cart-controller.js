import { CartService } from '../services/cart-service.js';

const cartService = new CartService();

export class CartController {
  static async getCartById(req, res) {
    try {
      const { cid } = req.params;
      const Cart = await cartService.getCartById(cid);
      if (!Cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      res.status(200).json(Cart);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching Cart', error: error?.message });
    }
  }

  static async createCart(req, res) {
    try {
      const {products} = req.body;
      const newCart = await cartService.createCart(products);
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ message: 'Error creating Cart', error: error?.message });
    }
  }

  static async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const updatedCart = await cartService.addProductToCart(cid, pid, quantity);
      if (!updatedCart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({
        message: 'Error adding product to Cart',
        error: error?.message,
      });
    }
  }

  static async updateProductQuantity(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      
      if (!quantity || isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be a positive number' });
      }
      
      const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({
        message: 'Error updating product quantity',
        error: error?.message,
      });
    }
  }

  static async updateCart(req, res) {
    try {
      const { cid } = req.params;
      const { products } = req.body;
      
      if (!products || !Array.isArray(products)) {
        return res.status(400).json({ message: 'Products must be an array' });
      }
      
      const updatedCart = await cartService.updateCart(cid, products);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({
        message: 'Error updating cart',
        error: error?.message,
      });
    }
  }

  static async removeProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const updatedCart = await cartService.removeProductFromCart(cid, pid);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({
        message: 'Error removing product from cart',
        error: error?.message,
      });
    }
  }

  static async clearCart(req, res) {
    try {
      const { cid } = req.params;
      const updatedCart = await cartService.clearCart(cid);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({
        message: 'Error clearing cart',
        error: error?.message,
      });
    }
  }
}
