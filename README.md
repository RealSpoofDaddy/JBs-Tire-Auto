# JB's Tire & Auto - Backend API

A comprehensive Node.js backend API for an eCommerce website selling tires and rims. Built with Express.js, MongoDB, and ready for Stripe payment integration.

## 🚀 Features

- **Product Management**: Full CRUD operations for tires and rims
- **Advanced Filtering**: Search by category, brand, price range, and more
- **Pagination**: Efficient data loading with pagination support
- **Validation**: Comprehensive data validation and error handling
- **Security**: Helmet, CORS, and rate limiting
- **Scalable Architecture**: Modular structure for easy expansion
- **Payment Ready**: Stripe integration setup for secure payments

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, Express Rate Limit
- **Environment**: dotenv for configuration
- **Development**: Nodemon for hot reloading

## 📁 Project Structure

```
JBs-Tire-Auto/
├── server.js              # Main server file
├── models/
│   └── Product.js          # Product model schema
├── routes/
│   └── productRoutes.js    # Product API routes
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
└── README.md              # Project documentation
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/JBs-Tire-Auto.git
   cd JBs-Tire-Auto
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Update the `.env` file with your configuration:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/jbs-tire-auto
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/jbs-tire-auto
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Add your Stripe keys when ready
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   ```

4. **Start MongoDB** (if using local installation)
   ```bash
   mongod
   ```

5. **Run the server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📋 API Endpoints

### Product Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products with filtering & pagination |
| GET | `/api/products/:id` | Get single product by ID |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product by ID |
| DELETE | `/api/products/:id` | Delete product by ID |
| GET | `/api/products/category/:category` | Get products by category |

### System Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API health check |
| GET | `/api/status` | Detailed API status |

## 🧪 Testing with Postman

### 1. GET All Products
```
GET http://localhost:5000/api/products
```

### 2. GET Single Product
```
GET http://localhost:5000/api/products/:productId
```

### 3. CREATE New Product
```
POST http://localhost:5000/api/products
Content-Type: application/json

{
  "name": "Michelin Pilot Sport 4S",
  "brand": "Michelin",
  "price": 299.99,
  "size": "225/45R17",
  "description": "High-performance summer tire with excellent grip and handling",
  "imageUrl": "https://example.com/tire-image.jpg",
  "category": "tire",
  "stockQuantity": 50,
  "inStock": true
}
```

### 4. UPDATE Product
```
PUT http://localhost:5000/api/products/:productId
Content-Type: application/json

{
  "price": 279.99,
  "stockQuantity": 45
}
```

### 5. DELETE Product
```
DELETE http://localhost:5000/api/products/:productId
```

## 🔍 Query Parameters

### Product Filtering
- `category`: Filter by product category (tire, rim, accessory)
- `brand`: Filter by brand name
- `minPrice` & `maxPrice`: Price range filtering
- `inStock`: Filter by stock availability (true/false)
- `search`: Text search across name, brand, and description

### Pagination
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Sorting
- `sortBy`: Field to sort by (default: createdAt)
- `sortOrder`: Sort order - asc/desc (default: desc)

### Example with Filters
```
GET http://localhost:5000/api/products?category=tire&brand=michelin&minPrice=200&maxPrice=400&page=1&limit=5
```

## 🔒 Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents API abuse (100 requests per 15 minutes)
- **Input Validation**: Comprehensive validation using Mongoose schemas
- **Error Handling**: Global error handling with proper status codes

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Heroku
- Digital Ocean
- AWS
- Vercel
- Railway

Make sure to:
1. Set production environment variables
2. Use MongoDB Atlas for cloud database
3. Update CORS settings for your frontend domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support, email support@jbstireandauto.com or create an issue on GitHub.

