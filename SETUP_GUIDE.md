# JB's Tire & Auto - Setup & Testing Guide

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Choose one:
  - Local installation: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
  - Cloud database: [MongoDB Atlas](https://www.mongodb.com/atlas) (recommended)
- **Postman** - [Download here](https://www.postman.com/downloads/) (for API testing)

### 2. Environment Setup

**MongoDB Setup Options:**

**Option A: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service: `mongod`
3. Keep the default `.env` setting: `MONGODB_URI=mongodb://localhost:27017/jbs-tire-auto`

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jbs-tire-auto
   ```

### 3. Installation & Running

```bash
# Install dependencies
npm install

# Start the server in development mode
npm run dev

# Or start in production mode
npm start
```

The server will start at `http://localhost:5000`

### 4. Database Seeding (Optional)

To populate your database with sample products:

```bash
npm run seed
```

This will add 10 sample products (tires, rims, and accessories) to your database.

## 🧪 Testing with Postman

### Method 1: Import Collection
1. Open Postman
2. Click "Import" button
3. Select the file: `JBs-Tire-Auto-API.postman_collection.json`
4. The collection will be imported with all test requests ready

### Method 2: Manual Testing

**1. Health Check**
```
GET http://localhost:5000/
```
Expected: `{"success": true, "message": "JB's Tire & Auto API is running..."}`

**2. Get All Products**
```
GET http://localhost:5000/api/products
```

**3. Create a New Product**
```
POST http://localhost:5000/api/products
Content-Type: application/json

{
  "name": "Michelin Pilot Sport 4S",
  "brand": "Michelin",
  "price": 299.99,
  "size": "225/45R17",
  "description": "High-performance summer tire",
  "imageUrl": "https://example.com/tire.jpg",
  "category": "tire",
  "stockQuantity": 50,
  "inStock": true
}
```

**4. Get Single Product**
```
GET http://localhost:5000/api/products/[PRODUCT_ID]
```
(Replace [PRODUCT_ID] with actual ID from previous response)

**5. Update Product**
```
PUT http://localhost:5000/api/products/[PRODUCT_ID]
Content-Type: application/json

{
  "price": 279.99,
  "stockQuantity": 45
}
```

**6. Delete Product**
```
DELETE http://localhost:5000/api/products/[PRODUCT_ID]
```

### Advanced Queries

**Filter by Category:**
```
GET http://localhost:5000/api/products?category=tire
```

**Price Range Filter:**
```
GET http://localhost:5000/api/products?minPrice=200&maxPrice=400
```

**Search Products:**
```
GET http://localhost:5000/api/products?search=michelin performance
```

**Pagination:**
```
GET http://localhost:5000/api/products?page=1&limit=5
```

**Combined Filters:**
```
GET http://localhost:5000/api/products?category=tire&brand=michelin&minPrice=200&maxPrice=400&page=1&limit=5
```

## 🔧 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
- Make sure MongoDB is running (if using local installation)
- Check your connection string in `.env` file
- For Atlas: Ensure your IP is whitelisted and credentials are correct

**2. Port Already in Use**
- Change the PORT in `.env` file: `PORT=5001`
- Or kill the process using port 5000

**3. NPM Install Fails**
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again
- Try `npm install --force` if issues persist

**4. PowerShell Execution Policy (Windows)**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Validation Errors

The API includes comprehensive validation. Common validation errors:

- **Missing required fields**: All fields marked as required must be provided
- **Invalid price**: Price must be a positive number
- **Invalid category**: Must be 'tire', 'rim', or 'accessory'
- **Invalid MongoDB ObjectId**: When getting/updating/deleting by ID

## 📊 API Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...},
  "pagination": {...} // Only for list endpoints
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...] // For validation errors
}
```

## 🚀 Next Steps

1. **Authentication**: Add user authentication and authorization
2. **Payment Integration**: Implement Stripe payment processing
3. **Image Upload**: Add image upload functionality
4. **Email Notifications**: Send order confirmations
5. **Inventory Management**: Advanced stock tracking
6. **Order Management**: Create order and customer models
7. **Frontend Integration**: Connect with React.js frontend

## 📞 Support

If you encounter any issues:
1. Check this guide first
2. Review the error messages in the console
3. Verify your environment variables
4. Test with the provided Postman collection

Happy coding! 🎉
