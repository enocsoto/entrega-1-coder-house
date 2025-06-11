import { Cart, Product } from '../models/index.js';
import { isMongoIdValid } from '../utils/validMongoIdValid.js';

export class CartService {
  async getCartById(id) {
    try {
      isMongoIdValid(id);
      const cart = await Cart.findById(id).populate('products.product');
      if (!cart) {
        throw new Error('Cart not found');
      }
      return cart;
    } catch (error) {
      throw new Error(`Error getting cart: ${error.message}`);
    }
  }

  async createCart(products) {
    try {
      // pasar los id de productos al carrito
      if (!Array.isArray(products)) {
        throw new Error('Products must be an array');
      }
      const cart = [];
      for (const item of products) {
        if (!item.id || !mongoose.Types.ObjectId.isValid(item.id)) {
          throw new Error('Invalid product ID format in products array');
        }
        const product = await Product.findById(item.id);
        if (!product) {
          throw new Error(`Product with ID ${item.id} not found`);
        }
        const newCart = new Cart({ products: [{ product: item.id }] });
        cart.push(await newCart.save());
      }

      if (!cart) {
        throw new Error('Failed to create cart');
      }
      return cart;
    } catch (error) {
      throw new Error(`Error creating cart: ${error.message}`);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      isMongoIdValid(cartId);
      isMongoIdValid(productId);

      // Verify product exists
      const [product, cart] = await Promise.all([
        Product.findById(productId),
        Cart.findById(cartId)
      ]);

      if (!product || !cart) {
        throw new Error('Product or cart not found');
      }

      // Check if product already exists in cart
      const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);

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
      isMongoIdValid(cartId);
      isMongoIdValid(productId);

      if (!quantity || isNaN(quantity) || quantity <= 0) {
        throw new Error('Quantity must be a positive number');
      }
      const [product, cart] = await Promise.all([Product.findById(productId), Cart.findById(cartId)]);

      if (!product || !cart) {
        throw new Error('Product or cart not found');
      }

      const productIndex = cart.products.findIndex((item) => item.product.id.toString() === productId);

      if (productIndex === -1) {
        throw new Error('Product not found in cart');
      }

      cart. products[productIndex].quantity = quantity;
      return await cart.save();
    } catch (error) {
      throw new Error(`Error updating product quantity: ${error.message}`);
    }
  }

  async updateCart(cartId, products) {
    try {
      isMongoIdValid(cartId);

      if (!Array.isArray(products)) {
        throw new Error('Products must be an array');
      }
      const productsToUpdate = [];
      for (const item of products) {
          isMongoIdValid(item.id);
        
          if (!item.quantity || item.quantity <= 0) {
          throw new Error('Quantity must be greater than 0 for all products');
          }
          productsToUpdate.push({
            product: item.id,
            quantity: item.quantity,
          });
      }

    const productExistenceChecks = products.map((item) => Product.findById(item.id));
    const foundProducts = await Promise.all(productExistenceChecks);

      if (foundProducts.some((product) => !product)) {
        throw new Error('One or more products in the provided list were not found in the database.');
      }
      const cart = await Cart.findById(cartId);
      
      if (!cart) {
        throw new Error('Cart not found');
      }
      cart.products = productsToUpdate;

      return await cart.save();
    } catch (error) {
      throw new Error(`Error updating cart: ${error.message}`);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      isMongoIdValid(cartId);
      isMongoIdValid(productId);

      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      cart.products = cart.products.filter((item) => item.product.id.toString() !== productId);

      return await cart.save();
    } catch (error) {
      throw new Error(`Error removing product from cart: ${error.message}`);
    }
  }

  async clearCart(cartId) {
    try {
      isMongoIdValid(cartId);

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
