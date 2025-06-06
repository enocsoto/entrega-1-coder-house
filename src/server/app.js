import express from 'express';
import cors from 'cors';
import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import products from '../routes/products.js';
import carts from '../routes/carts.js';
import viewsRouter from '../routes/views.router.js';
import { ProductManager } from '../utils/product-management.js';
import 'dotenv/config';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.server = HttpServer(this.app);
    this.io = new IOServer(this.server);
    this.productManager = new ProductManager();
    
    this.setupHandlebars();
    this.middlewares();
    this.routes();
    this.setupSockets();
  }

  setupHandlebars() {
    this.app.engine('handlebars', engine());
    this.app.set('views', path.join(__dirname, '../views'));
    this.app.set('view engine', 'handlebars');
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, '../public')));
    this.app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
      }),
    );
  }

  routes() {
    this.app.use('/', viewsRouter);
    this.app.use('/api/products', products);
    this.app.use('/api/carts', carts);
  }

  setupSockets() {
    this.io.on('connection', async (socket) => {
      console.log('New client connected');
      
      try {
        // Send initial product list to the connected client
        const products = await this.productManager.getProducts();
        socket.emit('products', products);
        
        // Listen for new product events
        socket.on('newProduct', async (product) => {
          try {
            // Add the product using ProductManager
            await this.productManager.addProduct(product);
            
            //  Get the updated product list
            const updatedProducts = await this.productManager.getProducts();
            
            // Emit the updated product list to all connected clients
            this.io.emit('products', updatedProducts);
          } catch (error) {
            console.error('Error al agregar producto:', error);
          }
        });
        
        // Listen for delete product events
        socket.on('deleteProduct', async (productId) => {
          try {
            // Delete the product using ProductManager
            await this.productManager.deleteProduct(productId);
            
            // Get the updated product list
            const updatedProducts = await this.productManager.getProducts();
            
            // Emit the updated product list to all connected clients
            this.io.emit('products', updatedProducts);
          } catch (error) {
            console.error('Error al eliminar producto:', error);
          }
        });
      } catch (error) {
        console.error('Error al cargar productos iniciales:', error);
      }
    });
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`);
    });
  }
}
