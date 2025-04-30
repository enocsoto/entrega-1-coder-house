import express from 'express';
import cors from 'cors';
import products from '../routes/products.js';
import carts from '../routes/carts.js';
import 'dotenv/config';


export class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.middlewares();
    this.routes();
  }

  middlewares(){
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
  }

  routes(){
    this.app.use('/api/products', products);
    this.app.use('/api/carts', carts);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
    

}