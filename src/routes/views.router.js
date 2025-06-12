import express from 'express';
import { ProductController } from '../controllers/product-controller.js';

const router = express.Router();
const productManager = new ProductController();

router.get('/products', async (req, res) => {
  try {
    const productsData = await productManager.getAllProductsByWeb(req.query, res);
    res.render('home', {
      products: productsData.payload,
      home: true,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error?.message });
  }
});

router.get('/products/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductByIdByWeb(req);
    
    if (!product) {
      return res.status(404).render('error', { message: 'Product not found' });
    }
    res.render('product-detail', {
      product: product.toObject(),
      productDetail: true
    });
  } catch (error) {
    res.status(500).render('error', { message: 'Error fetching product details', error: error?.message });
  }
});

router.get('/realtimeproducts', async (req, res) => {
  const productsData = await productManager.getAllProductsByWeb(req);
  res.render('realTimeProducts', {
    products: productsData.payload,
    realtime: true,
  });
});

export default router;
