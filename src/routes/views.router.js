import express from 'express';
import { getProducts } from '../utils/productUtils.js';

const router = express.Router();

// Ruta para la vista home
router.get('/', (req, res) => {
  const products = getProducts();
  res.render('home', { 
    products,
    home: true 
  });
});

// Ruta para la vista realTimeProducts
router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', {
    realtime: true
  });
});

export default router;