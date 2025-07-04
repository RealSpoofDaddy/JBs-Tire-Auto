const mongoose = require('mongoose');

// Enhanced schema for products with additional features
const productSchema = new mongoose.Schema({
  // Basic Product Information
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
    index: 'text'
  },
  
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
    maxlength: [100, 'Brand cannot exceed 100 characters'],
    index: true
  },
  
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    set: v => Math.round(v * 100) / 100 // Round to 2 decimal places
  },
  
  size: {
    type: String,
    required: [true, 'Size is required'],
    trim: true,
    maxlength: [50, 'Size cannot exceed 50 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    index: 'text'
  },
  
  // Media
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=JB%27s+Tire+%26+Auto',
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  },
  
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  
  // Inventory & Availability
  inStock: {
    type: Boolean,
    default: true,
    index: true
  },
  
  stockQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
  },
  
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: [0, 'Low stock threshold cannot be negative']
  },
  
  // Categorization
  category: {
    type: String,
    enum: {
      values: ['tires', 'rims', 'accessories', 'services'],
      message: 'Category must be one of: tires, rims, accessories, services'
    },
    default: 'tires',
    index: true
  },
  
  subcategory: {
    type: String,
    trim: true,
    maxlength: [100, 'Subcategory cannot exceed 100 characters']
  },
  
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  
  // Product Details
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  
  manufacturer: {
    type: String,
    trim: true,
    maxlength: [100, 'Manufacturer cannot exceed 100 characters']
  },
  
  model: {
    type: String,
    trim: true,
    maxlength: [100, 'Model cannot exceed 100 characters']
  },
  
  year: {
    type: Number,
    min: [1950, 'Year must be 1950 or later'],
    max: [new Date().getFullYear() + 2, 'Year cannot be more than 2 years in the future']
  },
  
  // Tire/Rim Specific Specifications
  specifications: {
    // Tire specifications
    diameter: String,
    width: String,
    sidewallHeight: String,
    loadIndex: String,
    speedRating: String,
    season: {
      type: String,
      enum: ['all-season', 'summer', 'winter']
    },
    treadPattern: String,
    
    // Rim specifications
    offset: String,
    boltPattern: String,
    centerBore: String,
    finish: String,
    
    // General specifications
    material: String,
    warranty: String,
    origin: String
  },
  
  // SEO and Marketing
  slug: {
    type: String,
    unique: true,
    index: true
  },
  
  metaTitle: String,
  metaDescription: String,
  
  // Pricing and Promotions
  originalPrice: Number,
  salePrice: Number,
  discountPercentage: {
    type: Number,
    min: [0, 'Discount percentage cannot be negative'],
    max: [100, 'Discount percentage cannot exceed 100']
  },
  
  // Reviews and Ratings
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  totalReviews: {
    type: Number,
    default: 0,
    min: [0, 'Total reviews cannot be negative']
  },
  
  // Status and Visibility
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  
  isNew: {
    type: Boolean,
    default: true
  },
  
  // Analytics
  viewCount: {
    type: Number,
    default: 0,
    min: [0, 'View count cannot be negative']
  },
  
  purchaseCount: {
    type: Number,
    default: 0,
    min: [0, 'Purchase count cannot be negative']
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  lastViewedAt: Date,
  lastPurchasedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance optimization
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ inStock: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ 'specifications.season': 1 });

// Virtual for current effective price
productSchema.virtual('currentPrice').get(function() {
  return this.salePrice || this.price;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stockQuantity === 0) return 'out-of-stock';
  if (this.stockQuantity <= this.lowStockThreshold) return 'low-stock';
  return 'in-stock';
});

// Virtual for discount amount
productSchema.virtual('discountAmount').get(function() {
  if (this.originalPrice && this.salePrice) {
    return this.originalPrice - this.salePrice;
  }
  return 0;
});

// Pre-save middleware to update timestamps and generate slug
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Generate slug from name if not provided
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Calculate discount percentage if sale price is set
  if (this.originalPrice && this.salePrice) {
    this.discountPercentage = Math.round(((this.originalPrice - this.salePrice) / this.originalPrice) * 100);
  }
  
  // Set originalPrice to price if not set
  if (!this.originalPrice) {
    this.originalPrice = this.price;
  }
  
  next();
});

// Pre-update middleware
productSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Static method to get products with filters
productSchema.statics.findWithFilters = function(filters = {}) {
  const query = this.find({ isActive: true });
  
  // Text search
  if (filters.search) {
    query.where({ $text: { $search: filters.search } });
  }
  
  // Category filter
  if (filters.category) {
    query.where({ category: filters.category });
  }
  
  // Brand filter
  if (filters.brand) {
    query.where({ brand: new RegExp(filters.brand, 'i') });
  }
  
  // Stock filter
  if (filters.inStock !== undefined) {
    query.where({ inStock: filters.inStock });
  }
  
  // Price range filter
  if (filters.minPrice || filters.maxPrice) {
    const priceFilter = {};
    if (filters.minPrice) priceFilter.$gte = filters.minPrice;
    if (filters.maxPrice) priceFilter.$lte = filters.maxPrice;
    query.where({ price: priceFilter });
  }
  
  // Featured filter
  if (filters.isFeatured) {
    query.where({ isFeatured: true });
  }
  
  return query;
};

// Instance method to increment view count
productSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  this.lastViewedAt = new Date();
  return this.save();
};

// Instance method to increment purchase count
productSchema.methods.incrementPurchaseCount = function() {
  this.purchaseCount += 1;
  this.lastPurchasedAt = new Date();
  return this.save();
};

// Instance method to update stock
productSchema.methods.updateStock = function(quantity) {
  this.stockQuantity = Math.max(0, this.stockQuantity + quantity);
  this.inStock = this.stockQuantity > 0;
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);
