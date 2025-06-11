import { Router } from 'express';
import { ProductController } from '../controllers/product-controller.js';

const router = Router();
const productManager = new ProductController();
router.get('/', productManager.getAllProducts);
router.get('/:pid', productManager.getProductById);
router.post('/', productManager.createProduct);
router.put('/:pid', productManager.updateProduct);
router.delete('/:pid', productManager.deleteProduct);

export default router;
