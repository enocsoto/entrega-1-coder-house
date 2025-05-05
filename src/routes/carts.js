import { Router } from 'express';
import { CartController } from '../controllers/cart-controller.js';

const router = Router();

router.post('/', CartController.createCart);
router.post('/:cid/product/:pid', CartController.addProductToCart);
router.get('/:cid', CartController.getCartById);

export default router;
