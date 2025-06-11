import { Router } from 'express';
import { CartController } from '../controllers/cart-controller.js';

const router = Router();

// Rutas existentes
router.post('/', CartController.createCart);
router.get('/:cid', CartController.getCartById);

// Rutas para agregar productos al carrito
router.post('/:cid/products/:pid', CartController.addProductToCart);

// Nuevos endpoints requeridos
router.put('/:cid/products/:pid', CartController.updateProductQuantity); // Actualizar cantidad de un producto
router.put('/:cid', CartController.updateCart); // Actualizar carrito con un arreglo de productos
router.delete('/:cid/products/:pid', CartController.removeProductFromCart); // Eliminar un producto del carrito
router.delete('/:cid', CartController.clearCart); // Eliminar todos los productos del carrito

export default router;
