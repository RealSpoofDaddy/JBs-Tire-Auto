const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @desc    Get all products with optional filtering and pagination
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Extract query parameters for filtering and pagination
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (inStock !== undefined) filter.inStock = inStock === 'true';
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice) * 100; // Convert to cents
      if (maxPrice) filter.price.$lte = parseInt(maxPrice) * 100; // Convert to cents
    }
    
    // Text search across name, brand, and description
    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination info
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNum);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
      error: error.message
    });
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
      error: error.message
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (will add authentication later)
router.post('/', async (req, res) => {
  try {
    // Extract product data from request body
    const {
      name,
      brand,
      price,
      size,
      description,
      imageUrl,
      inStock = true,
      category,
      stockQuantity = 0,
      specifications = {}
    } = req.body;

    // Validate required fields
    if (!name || !brand || !price || !size || !description || !imageUrl || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, brand, price, size, description, imageUrl, category'
      });
    }

    // Convert price to cents if it's in dollars
    const priceInCents = typeof price === 'string' ? 
      Math.round(parseFloat(price) * 100) : 
      Math.round(price * 100);

    // Create new product
    const product = new Product({
      name: name.trim(),
      brand: brand.trim(),
      price: priceInCents,
      size: size.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      inStock,
      category: category.toLowerCase(),
      stockQuantity: parseInt(stockQuantity),
      specifications
    });

    // Save product to database
    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating product',
      error: error.message
    });
  }
});

// @desc    Update product by ID
// @route   PUT /api/products/:id
// @access  Private (will add authentication later)
router.put('/:id', async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    // Check if product exists
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Extract update data from request body
    const updateData = { ...req.body };
    
    // Convert price to cents if provided
    if (updateData.price) {
      updateData.price = typeof updateData.price === 'string' ? 
        Math.round(parseFloat(updateData.price) * 100) : 
        Math.round(updateData.price * 100);
    }

    // Trim string fields
    ['name', 'brand', 'size', 'description', 'imageUrl'].forEach(field => {
      if (updateData[field]) {
        updateData[field] = updateData[field].trim();
      }
    });

    // Normalize category
    if (updateData.category) {
      updateData.category = updateData.category.toLowerCase();
    }

    // Update product with new data
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true, // Return updated document
        runValidators: true // Run schema validation
      }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating product',
      error: error.message
    });
  }
});

// @desc    Delete product by ID
// @route   DELETE /api/products/:id
// @access  Private (will add authentication later)
router.delete('/:id', async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    // Find and delete product
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product',
      error: error.message
    });
  }
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find({ 
      category: category.toLowerCase(),
      inStock: true 
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalProducts = await Product.countDocuments({ 
      category: category.toLowerCase(),
      inStock: true 
    });

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalProducts / limitNum),
        totalProducts
      }
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products by category',
      error: error.message
    });
  }
});

module.exports = router;
