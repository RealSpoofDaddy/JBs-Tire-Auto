const Joi = require('joi');

/**
 * Product creation validation schema
 */
const createProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 2 characters long',
      'string.max': 'Product name cannot exceed 200 characters',
    }),
  
  brand: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Brand is required',
      'string.max': 'Brand cannot exceed 100 characters',
    }),
  
  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be positive',
      'any.required': 'Price is required',
    }),
  
  size: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Size is required',
      'string.max': 'Size cannot exceed 50 characters',
    }),
  
  description: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 2000 characters',
    }),
  
  imageUrl: Joi.string()
    .uri()
    .optional()
    .allow('')
    .messages({
      'string.uri': 'Image URL must be a valid URL',
    }),
  
  inStock: Joi.boolean()
    .optional()
    .default(true),
  
  category: Joi.string()
    .trim()
    .valid('tires', 'rims', 'accessories', 'services')
    .optional()
    .default('tires')
    .messages({
      'any.only': 'Category must be one of: tires, rims, accessories, services',
    }),
  
  weight: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.positive': 'Weight must be positive',
    }),
  
  manufacturer: Joi.string()
    .trim()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Manufacturer cannot exceed 100 characters',
    }),
  
  specifications: Joi.object({
    diameter: Joi.string().optional(),
    width: Joi.string().optional(),
    sidewallHeight: Joi.string().optional(),
    loadIndex: Joi.string().optional(),
    speedRating: Joi.string().optional(),
    season: Joi.string().valid('all-season', 'summer', 'winter').optional(),
    treadPattern: Joi.string().optional(),
  }).optional(),
  
  tags: Joi.array()
    .items(Joi.string().trim().max(50))
    .max(10)
    .optional()
    .messages({
      'array.max': 'Cannot have more than 10 tags',
    }),
});

/**
 * Product update validation schema (all fields optional)
 */
const updateProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Product name must be at least 2 characters long',
      'string.max': 'Product name cannot exceed 200 characters',
    }),
  
  brand: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.max': 'Brand cannot exceed 100 characters',
    }),
  
  price: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be positive',
    }),
  
  size: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .optional()
    .messages({
      'string.max': 'Size cannot exceed 50 characters',
    }),
  
  description: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .optional()
    .messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 2000 characters',
    }),
  
  imageUrl: Joi.string()
    .uri()
    .optional()
    .allow('')
    .messages({
      'string.uri': 'Image URL must be a valid URL',
    }),
  
  inStock: Joi.boolean().optional(),
  
  category: Joi.string()
    .trim()
    .valid('tires', 'rims', 'accessories', 'services')
    .optional()
    .messages({
      'any.only': 'Category must be one of: tires, rims, accessories, services',
    }),
  
  weight: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.positive': 'Weight must be positive',
    }),
  
  manufacturer: Joi.string()
    .trim()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Manufacturer cannot exceed 100 characters',
    }),
  
  specifications: Joi.object({
    diameter: Joi.string().optional(),
    width: Joi.string().optional(),
    sidewallHeight: Joi.string().optional(),
    loadIndex: Joi.string().optional(),
    speedRating: Joi.string().optional(),
    season: Joi.string().valid('all-season', 'summer', 'winter').optional(),
    treadPattern: Joi.string().optional(),
  }).optional(),
  
  tags: Joi.array()
    .items(Joi.string().trim().max(50))
    .max(10)
    .optional()
    .messages({
      'array.max': 'Cannot have more than 10 tags',
    }),
});

/**
 * Product query validation schema
 */
const productQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  sort: Joi.string().valid('name', '-name', 'price', '-price', 'createdAt', '-createdAt').optional().default('-createdAt'),
  search: Joi.string().trim().max(100).optional(),
  category: Joi.string().valid('tires', 'rims', 'accessories', 'services').optional(),
  brand: Joi.string().trim().max(100).optional(),
  inStock: Joi.boolean().optional(),
  minPrice: Joi.number().positive().optional(),
  maxPrice: Joi.number().positive().optional(),
});

/**
 * MongoDB ObjectId validation
 */
const objectIdSchema = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    'string.pattern.base': 'Invalid product ID format',
    'any.required': 'Product ID is required',
  });

/**
 * Validation middleware generator
 */
const validate = schema => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    req.body = value;
    next();
  };
};

/**
 * Query validation middleware
 */
const validateQuery = schema => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        errors,
      });
    }

    req.query = value;
    next();
  };
};

/**
 * ObjectId parameter validation
 */
const validateObjectId = (req, res, next) => {
  const { error } = objectIdSchema.validate(req.params.id);

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID format',
    });
  }

  next();
};

module.exports = {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  objectIdSchema,
  validate,
  validateQuery,
  validateObjectId,
};