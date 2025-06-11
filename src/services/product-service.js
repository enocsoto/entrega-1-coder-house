import { Product } from '../models/index.js';
import { productSchema } from '../dto/product-schema.dto.js';
import { isMongoIdValid } from '../utils/validMongoIdValid.js';

export class ProductService {

  async getAllProducts(options = {}) {
    try {
      const {
        limit = 10,
        page = 1,
        sort,
        category,
        status
      } = options;

      const filter = {};
      
      if (category) filter.category = category;
      
      if (status !== undefined) filter.status = status;

      const sortOptions = {};
      if (sort) sortOptions.price = sort === 'asc' ? 1 : -1;
      
      // Ejecutar la consulta con paginación
      const result = await Product.paginate(filter, {
        limit: parseInt(limit),
        page : parseInt(page),
        sort: Object.keys(sortOptions).length > 0 ? sortOptions : undefined,
        lean: true
      });

      // Construir los enlaces de paginación
      const baseUrl = '/api/products';
      const prevLink = result.hasPrevPage
        ? `${baseUrl}?limit=${limit}&page=${result.prevPage}${sort 
          ? `&sort=${sort}` 
          : ''}${category 
              ? `&category=${category}` 
              : ''}${status !== undefined 
                  ? `&status=${status}` 
                  : ''}`
        : null;
      const nextLink = result.hasNextPage
        ? `${baseUrl}?limit=${limit}&page=${result.nextPage}${sort ? `&sort=${sort}` : ''}${category ? `&category=${category}` : ''}${status !== undefined ? `&status=${status}` : ''}`
        : null;

      // Formatear la respuesta según los requisitos
      return {
        status: 'success',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink,
        nextLink
      };
    } catch (error) {
      throw new Error(`Error getting products: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      isMongoIdValid(id);
      const product = await Product.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw new Error(`Error getting product: ${error.message}`);
    }
  }

  async createProduct(productData) {
    try {
      const validatedData = productSchema.parse(productData);
      const newProduct = new Product(validatedData);
      return await newProduct.save();
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  async updateProduct(productId, updateData) {
    try {
      this.isMongoIdValid(productId);
      if (updateData.id) {
        throw new Error(`Updating the product ID is not allowed`);
      }
      const validatedData = productSchema.partial().parse(updateData);
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        validatedData,
        { new: true }
      );
      if (!updatedProduct) {
        throw new Error('Product not found');
      }
      return updatedProduct;
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      isMongoIdValid(id);

      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        throw new Error('Product not found');
      }
      return deletedProduct;
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }

}
