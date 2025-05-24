import express from 'express';
import { ProductManager } from '../utils/index.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (_req, res) => {
  const products = await productManager.getProducts();
  res.render('home', {
    products,
    home: true,
  });
});

router.get('/realtimeproducts', (_req, res) => {
  const products = productManager.getProducts();
  res.render('realTimeProducts', {
    products,
    realtime: true,
  });
});

export default router;
