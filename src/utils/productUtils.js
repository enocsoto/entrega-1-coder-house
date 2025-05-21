import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsFilePath = path.join(__dirname, '../config/products.json');

export const getProducts = () => {
  try {
    if (!fs.existsSync(productsFilePath)) {
      return [];
    }
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer los productos:', error);
    return [];
  }
};

export const saveProducts = (products) => {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error al guardar los productos:', error);
  }
};