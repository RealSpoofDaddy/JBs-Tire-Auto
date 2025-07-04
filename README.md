# 🚗 JB's Tire & Auto - Modern eCommerce API v2.0

A modern, secure, and scalable Node.js backend API for JB's Tire & Auto eCommerce platform built with best practices and production-ready features.

## ✨ Features

### 🔐 Security
- **JWT Authentication** with refresh tokens
- **Rate limiting** to prevent abuse
- **Input validation** with Joi schemas
- **Security headers** with Helmet
- **CORS configuration** for safe cross-origin requests
- **Error handling** with proper logging

### 📊 Advanced Product Management
- **Enhanced Product Model** with specifications, ratings, and analytics
- **Advanced Search** with text indexing and filters
- **Pagination** and sorting
- **Stock management** with low-stock alerts
- **Featured products** and categorization
- **Bulk operations** for efficient management

### 🚀 Performance
- **Compression** middleware for faster responses
- **Database indexing** for optimized queries
- **Caching strategies** ready for Redis
- **Request/Response logging** for monitoring
- **Graceful shutdown** handling

### 🛠️ Developer Experience
- **TypeScript-ready** with proper error handling
- **Comprehensive validation** with detailed error messages
- **Structured logging** with Winston
- **Code quality** with ESLint and Prettier
- **Environment configuration** with extensive options

## 🏗️ Architecture

```
JBs-Tire-Auto/
├── 📁 config/
│   └── logger.js           # Winston logging configuration
├── 📁 middleware/
│   ├── auth.js             # JWT authentication middleware
│   └── errorHandler.js     # Global error handling
├── 📁 models/
│   └── Product.js          # Enhanced product model
├── 📁 routes/
│   ├── authRoutes.js       # Authentication endpoints
│   └── productRoutes.js    # Product CRUD operations
├── 📁 validation/
│   └── productValidation.js # Joi validation schemas
├── 📁 logs/               # Application logs (auto-created)
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
└── .env.example          # Environment variables template
```

## � Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 4.4+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JBs-Tire-Auto
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env file
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
# Essential Configuration
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jbs-tire-auto

# JWT Secrets (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
```

## 📚 API Documentation

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "jbstire2024"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Product Endpoints

#### Get All Products (with filters)
```http
GET /api/products?page=1&limit=10&category=tires&search=michelin
```

#### Get Featured Products
```http
GET /api/products/featured
```

#### Advanced Search
```http
GET /api/products/search?q=all-season&limit=5
```

#### Get Product Statistics
```http
GET /api/products/stats
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Michelin All-Season Tires",
  "brand": "Michelin",
  "price": 299.99,
  "size": "225/60R16",
  "description": "High-quality all-season tires...",
  "category": "tires",
  "specifications": {
    "season": "all-season",
    "diameter": "16",
    "width": "225"
  }
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 279.99,
  "inStock": true
}
```

#### Update Stock (Admin Only)
```http
PATCH /api/products/:id/stock
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 10
}
```

#### Toggle Featured Status (Admin Only)
```http
PATCH /api/products/:id/toggle-featured
Authorization: Bearer <token>
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

## 🔍 Query Parameters

### Product Filtering
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sort` - Sort by field (name, -name, price, -price, createdAt, -createdAt)
- `search` - Text search across name, description, brand
- `category` - Filter by category (tires, rims, accessories, services)
- `brand` - Filter by brand
- `inStock` - Filter by stock status (true/false)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `isFeatured` - Filter featured products

## 🛡️ Security Features

### Rate Limiting
- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **Production**: Automatically adjusted limits

### Input Validation
- **Joi schemas** for all inputs
- **MongoDB injection** prevention
- **XSS protection** with sanitization
- **File upload** size limits

### Authentication
- **JWT tokens** with expiration
- **Refresh tokens** for session management
- **Role-based access** (admin/user)
- **Secure headers** with Helmet

## 📊 Monitoring & Logging

### Health Checks
```http
GET /health
GET /api/status
```

### Log Files
- `logs/combined.log` - All application logs
- `logs/error.log` - Error logs only
- Console output in development mode

### Performance Monitoring
- Request/response logging
- Database query monitoring
- Memory usage tracking
- Uptime monitoring

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Check code style
npm run lint

# Fix code style issues
npm run lint:fix

# Format code
npm run format
```

## 🚀 Deployment

### Docker Deployment
```dockerfile
# Build image
docker build -t jbs-tire-auto .

# Run container
docker run -p 5000:5000 --env-file .env jbs-tire-auto
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure MongoDB Atlas connection
3. Set secure JWT secrets (32+ characters)
4. Configure CORS for your domain
5. Set up SSL/TLS certificates
6. Configure monitoring and logging

### Production Checklist
- [ ] Environment variables configured
- [ ] Database connection secured
- [ ] JWT secrets changed
- [ ] CORS origins configured
- [ ] SSL certificate installed
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Error tracking configured

## 🔧 Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest",
  "test:watch": "jest --watch",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write ."
}
```

## � Performance Optimizations

### Database
- **Indexes** on frequently queried fields
- **Text search** indexes for product search
- **Compound indexes** for complex queries
- **Lean queries** for better performance

### API
- **Compression** for reduced payload size
- **Pagination** to limit response size
- **Field selection** for optimized queries
- **Caching** headers for static content

### Security
- **Rate limiting** to prevent abuse
- **Input validation** to prevent malformed requests
- **Error boundaries** for graceful failure handling
- **Request size limits** to prevent DoS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run linting and tests
6. Submit a pull request

## � License

This project is proprietary software for JB's Tire & Auto.

## 🆘 Support

For technical support or questions:
- Check the logs in `logs/` directory
- Review the API documentation above
- Test endpoints with the provided examples
- Verify environment configuration

---

**Built with ❤️ for JB's Tire & Auto** 🚗💼

