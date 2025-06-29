const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const sampleProducts = require('./sampleData');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing products
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    
    // Insert sample products
    console.log('Inserting sample products...');
    const insertedProducts = await Product.insertMany(sampleProducts);
    
    console.log(`✅ Successfully inserted ${insertedProducts.length} products`);
    
    // Display inserted products
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.formattedPrice} (${product.category})`);
    });
    
    console.log('\n🎉 Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close database connection
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
seedDatabase();
