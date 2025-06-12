import express from 'express';
import cors from 'cors';
import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import products from '../routes/products.js';
import carts from '../routes/carts.js';
import viewsRouter from '../routes/views.router.js';
import { connectDB } from '../config/db.js';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { ProductService } from '../services/product-service.js';
import { CartService } from '../services/cart-service.js';
import { multiply, calculateTotal, eq } from '../utils/handlebars-helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.server = HttpServer(this.app);
    this.io = new IOServer(this.server);
    this.productRepository = new ProductService();
    this.cartRepository = new CartService(); 

    this.setupHandlebars();
    this.middlewares();
    this.connectToDatabase();
    this.routes();
    this.setupSockets();
  }

  async connectToDatabase() {
    try {
      await connectDB();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error.message);
      process.exit(1);
    }
  }

  setupHandlebars() {
    this.app.engine('handlebars', engine({
      helpers: {
        multiply,
        calculateTotal,
        eq
      }
    }));
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
        const result = await this.productRepository.getAllProducts();
        socket.emit('products', result.payload); // Send just the products array
        
        // Listen for new product events
        socket.on('newProduct', async (product) => {
          try {
            await this.productRepository.createProduct(product);
            const updatedResult = await this.productRepository.getAllProducts();
            this.io.emit('products', updatedResult.payload); // Send just the products array
          } catch (error) {
            console.error('Error al agregar producto:', error);
          }
        });
        
        // Listen for delete product events
        socket.on('deleteProduct', async (productId) => {
          try {
            await this.productRepository.deleteProduct(productId);
            const updatedResult = await this.productRepository.getAllProducts();
            this.io.emit('products', updatedResult.payload); // Send just the products array
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
