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

  static async createCart(_req, res) {
    try {
      const newCart = await cartService.createCart();
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ message: 'Error creating Cart', error: error?.message });
    }
  }

  static async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const updatedCart = await cartService.addProductToCart(cid, pid);
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
}
