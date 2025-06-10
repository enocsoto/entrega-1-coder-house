import { Product } from '../models/index.js';

export class ProductRepository {
  async getAll(options = {}) {
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
          : ''}${query.category 
              ? `&category=${query.category}` 
              : ''}${query.status !== undefined 
                  ? `&status=${query.status}` 
                  : ''}`
        : null;
      const nextLink = result.hasNextPage
        ? `${baseUrl}?limit=${limit}&page=${result.nextPage}${sort ? `&sort=${sort}` : ''}${query.category ? `&category=${query.category}` : ''}${query.status !== undefined ? `&status=${query.status}` : ''}`
        : null;

      // Formatear la respuesta según los requisitos
      return {
        status: status ? 'success': 'error',
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

  async getById(id) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw new Error(`Error getting product: ${error.message}`);
    }
  }

  async create(productData) {
    try {
      const newProduct = new Product(productData);
      return await newProduct.save();
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  async update(id, productData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        productData,
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

  async delete(id) {
    try {
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