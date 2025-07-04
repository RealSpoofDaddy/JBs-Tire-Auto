const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const {
  validate,
  validateQuery,
  validateObjectId,
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} = require('../validation/productValidation');
const logger = require('../config/logger');

/**
 * @route   GET /api/products
 * @desc    Get all products with advanced filtering, pagination, and search
 * @access  Public
 */
router.get('/', validateQuery(productQuerySchema), catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = '-createdAt',
    search,
    category,
    brand,
    inStock,
    minPrice,
    maxPrice,
    isFeatured
  } = req.query;

  // Build filter object
  const filters = {
    search,
    category,
    brand,
    inStock,
    minPrice,
    maxPrice,
    isFeatured
  };

  // Remove undefined values
  Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

  // Use the static method for filtering
  const query = Product.findWithFilters(filters);

  // Apply sorting
  query.sort(sort);

  // Calculate pagination
  const skip = (page - 1) * limit;
  const total = await Product.countDocuments(query.getFilter());
  const totalPages = Math.ceil(total / limit);

  // Execute query with pagination
  const products = await query
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  // Add virtual fields manually for lean queries
  const enhancedProducts = products.map(product => ({
    ...product,
    currentPrice: product.salePrice || product.price,
    stockStatus: product.stockQuantity === 0 ? 'out-of-stock' : 
                product.stockQuantity <= product.lowStockThreshold ? 'low-stock' : 'in-stock',
    discountAmount: product.originalPrice && product.salePrice ? 
                   product.originalPrice - product.salePrice : 0
  }));

  res.json({
    success: true,
    data: enhancedProducts,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    filters: {
      applied: filters,
      available: {
        categories: ['tires', 'rims', 'accessories', 'services'],
        sortOptions: ['name', '-name', 'price', '-price', 'createdAt', '-createdAt']
      }
    }
  });
}));

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 */
router.get('/featured', catchAsync(async (req, res) => {
  const featuredProducts = await Product.find({
    isActive: true,
    isFeatured: true
  })
    .sort('-createdAt')
    .limit(8)
    .lean();

  res.json({
    success: true,
    data: featuredProducts,
    count: featuredProducts.length
  });
}));

/**
 * @route   GET /api/products/search
 * @desc    Advanced product search with autocomplete suggestions
 * @access  Public
 */
router.get('/search', catchAsync(async (req, res) => {
  const { q, limit = 10 } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Search query must be at least 2 characters long'
    });
  }

  // Text search with MongoDB text index
  const products = await Product.find({
    $text: { $search: q },
    isActive: true
  })
    .select('name brand price imageUrl category')
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit))
    .lean();

  // Get search suggestions (brands and categories)
  const suggestions = await Product.aggregate([
    {
      $match: {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { brand: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } }
        ],
        isActive: true
      }
    },
    {
      $group: {
        _id: null,
        brands: { $addToSet: '$brand' },
        categories: { $addToSet: '$category' }
      }
    }
  ]);

  res.json({
    success: true,
    query: q,
    data: products,
    suggestions: suggestions[0] || { brands: [], categories: [] },
    count: products.length
  });
}));

/**
 * @route   GET /api/products/stats
 * @desc    Get product statistics
 * @access  Public
 */
router.get('/stats', catchAsync(async (req, res) => {
  const stats = await Product.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        inStockCount: {
          $sum: { $cond: ['$inStock', 1, 0] }
        },
        outOfStockCount: {
          $sum: { $cond: ['$inStock', 0, 1] }
        }
      }
    }
  ]);

  const categoryStats = await Product.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        averagePrice: { $avg: '$price' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || {},
      byCategory: categoryStats
    }
  });
}));

/**
 * @route   GET /api/products/:id
 * @desc    Get a single product by ID
 * @access  Public
 */
router.get('/:id', validateObjectId, catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Increment view count
  await product.incrementViewCount();

  res.json({
    success: true,
    data: product
  });
}));

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (Admin only)
 */
router.post('/', 
  authenticateToken,
  requireAdmin,
  validate(createProductSchema),
  catchAsync(async (req, res) => {
    const product = new Product(req.body);
    const savedProduct = await product.save();

    logger.info(`Product created: ${savedProduct.name} (ID: ${savedProduct._id})`);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });
  })
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private (Admin only)
 */
router.put('/:id',
  authenticateToken,
  requireAdmin,
  validateObjectId,
  validate(updateProductSchema),
  catchAsync(async (req, res) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    logger.info(`Product updated: ${product.name} (ID: ${product._id})`);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  })
);

/**
 * @route   PATCH /api/products/:id/stock
 * @desc    Update product stock quantity
 * @access  Private (Admin only)
 */
router.patch('/:id/stock',
  authenticateToken,
  requireAdmin,
  validateObjectId,
  catchAsync(async (req, res) => {
    const { quantity } = req.body;

    if (typeof quantity !== 'number') {
      throw new AppError('Quantity must be a number', 400);
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await product.updateStock(quantity);

    logger.info(`Stock updated for product: ${product.name} (ID: ${product._id}), New quantity: ${product.stockQuantity}`);

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: {
        productId: product._id,
        name: product.name,
        stockQuantity: product.stockQuantity,
        stockStatus: product.stockStatus,
        inStock: product.inStock
      }
    });
  })
);

/**
 * @route   PATCH /api/products/:id/toggle-featured
 * @desc    Toggle product featured status
 * @access  Private (Admin only)
 */
router.patch('/:id/toggle-featured',
  authenticateToken,
  requireAdmin,
  validateObjectId,
  catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    logger.info(`Featured status toggled for product: ${product.name} (ID: ${product._id}), Featured: ${product.isFeatured}`);

    res.json({
      success: true,
      message: `Product ${product.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: {
        productId: product._id,
        name: product.name,
        isFeatured: product.isFeatured
      }
    });
  })
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product (soft delete by setting isActive to false)
 * @access  Private (Admin only)
 */
router.delete('/:id',
  authenticateToken,
  requireAdmin,
  validateObjectId,
  catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Soft delete by setting isActive to false
    product.isActive = false;
    await product.save();

    logger.info(`Product soft deleted: ${product.name} (ID: ${product._id})`);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  })
);

/**
 * @route   DELETE /api/products/:id/permanent
 * @desc    Permanently delete a product
 * @access  Private (Admin only)
 */
router.delete('/:id/permanent',
  authenticateToken,
  requireAdmin,
  validateObjectId,
  catchAsync(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    logger.warn(`Product permanently deleted: ${product.name} (ID: ${product._id})`);

    res.json({
      success: true,
      message: 'Product permanently deleted'
    });
  })
);

/**
 * @route   POST /api/products/bulk
 * @desc    Bulk create products
 * @access  Private (Admin only)
 */
router.post('/bulk',
  authenticateToken,
  requireAdmin,
  catchAsync(async (req, res) => {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      throw new AppError('Products array is required and cannot be empty', 400);
    }

    if (products.length > 100) {
      throw new AppError('Cannot bulk create more than 100 products at once', 400);
    }

    const createdProducts = await Product.insertMany(products, {
      ordered: false, // Continue processing even if some documents fail
      runValidators: true
    });

    logger.info(`Bulk created ${createdProducts.length} products`);

    res.status(201).json({
      success: true,
      message: `Successfully created ${createdProducts.length} products`,
      data: createdProducts,
      count: createdProducts.length
    });
  })
);

module.exports = router;
