const mongoose = require('mongoose');

// Schema for products (rims and tires)
const productSchema = new mongoose.Schema({
  // Product name
  name: {
    type: String,
    required: true,
    trim: true
  },
  // Brand of the product
  brand: {
    type: String,
    required: true,
    trim: true
  },
  // Price in dollars
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // Size information (e.g. tire size or rim diameter)
  size: {
    type: String,
    required: true,
    trim: true
  },
  // Detailed description
  description: {
    type: String,
    required: true,
    trim: true
  },
  // Image URL for product display
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  // Whether the product is currently in stock
  inStock: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Product', productSchema);
