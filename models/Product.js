const mongoose = require('mongoose');

// Define the Product schema for tires and rims
const productSchema = new mongoose.Schema({
  // Basic product information
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  
  // Brand information (e.g., Michelin, Goodyear, etc.)
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
    maxLength: [50, 'Brand name cannot exceed 50 characters']
  },
  
  // Product price in cents (to avoid floating point issues)
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  
  // Size information (e.g., 225/60R16 for tires, 16x7 for rims)
  size: {
    type: String,
    required: [true, 'Size is required'],
    trim: true,
    maxLength: [30, 'Size cannot exceed 30 characters']
  },
  
  // Detailed product description
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxLength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Product image URL
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  
  // Stock availability
  inStock: {
    type: Boolean,
    default: true
  },
  
  // Product category (tire or rim)
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['tire', 'rim', 'accessory'],
    lowercase: true
  },
  
  // Inventory count
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  
  // Product specifications (flexible object for different product types)
  specifications: {
    type: Map,
    of: String,
    default: {}
  }
}, {
  // Add timestamps for created and updated dates
  timestamps: true
});

// Create indexes for better query performance
productSchema.index({ name: 'text', brand: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ inStock: 1 });
productSchema.index({ price: 1 });

// Virtual for formatted price in dollars
productSchema.virtual('formattedPrice').get(function() {
  return (this.price / 100).toFixed(2);
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

// Export the Product model
module.exports = mongoose.model('Product', productSchema);
