import { ProductService } from '../services/product-service.js';

const productService = new ProductService();

export class ProductController {
  async getAllProducts(req, res) {
    try {
      const result = await productService.getAllProducts(req.query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error: error?.message });
    }
  }

  async getProductById(req, res) {
    try {
      const { pid } = req.params;
      const product = await productService.getProductById(pid);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product', error: error?.message });
    }
  }

  async createProduct(req, res) {
    try {
      const productData = req.body;
      const newProduct = await productService.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: 'Error creating product', error: error?.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const { pid } = req.params;
      const productData = req.body;
      const updatedProduct = await productService.updateProduct(pid, productData);
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Error updating product', error: error?.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { pid } = req.params;
      const deletedProduct = await productService.deleteProduct(pid);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product', error: error?.message });
    }
  }
  async getAllProductsByWeb(req, res) {
    try {
      const result = await productService.getAllProducts(req.query);
      return result;
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error: error?.message });
    }
  }

  async getProductByIdByWeb(req, res) {
    try {
      const { pid } = req.params;
      const product = await productService.getProductById(pid);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return product;
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product', error: error?.message });
    }
  }
}
