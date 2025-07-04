// Product type definition matching the backend model
export interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  size: string;
  description: string;
  imageUrl: string;
  inStock: boolean;
}

// Type for creating a new product (without _id)
export interface CreateProductRequest {
  name: string;
  brand: string;
  price: number;
  size: string;
  description: string;
  imageUrl: string;
  inStock: boolean;
}

// Type for updating a product (all fields optional except _id)
export interface UpdateProductRequest {
  name?: string;
  brand?: string;
  price?: number;
  size?: string;
  description?: string;
  imageUrl?: string;
  inStock?: boolean;
}