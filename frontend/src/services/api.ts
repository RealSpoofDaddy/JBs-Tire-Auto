import axios, { AxiosResponse } from 'axios';
import { Product, CreateProductRequest, UpdateProductRequest } from '../types/Product';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service class for all backend operations
export class ApiService {
  // Get all products
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response: AxiosResponse<Product[]> = await api.get('/api/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  // Get single product by ID
  static async getProductById(id: string): Promise<Product> {
    try {
      const response: AxiosResponse<Product> = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    }
  }

  // Create new product (admin only)
  static async createProduct(product: CreateProductRequest): Promise<Product> {
    try {
      const response: AxiosResponse<Product> = await api.post('/api/products', product);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  // Update product (admin only)
  static async updateProduct(id: string, updates: UpdateProductRequest): Promise<Product> {
    try {
      const response: AxiosResponse<Product> = await api.put(`/api/products/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  // Delete product (admin only)
  static async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(`/api/products/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }

  // Test API connection
  static async testConnection(): Promise<boolean> {
    try {
      const response = await api.get('/');
      return response.status === 200;
    } catch (error) {
      console.error('API connection failed:', error);
      return false;
    }
  }
}