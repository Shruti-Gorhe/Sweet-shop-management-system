// Load environment variables
require('dotenv').config();

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');
const Sweet = require('./models/Sweet');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Function to generate AI-based image URL from product name
const generateAIImageURL = (productName) => {
  // Using Pollinations.ai for AI-generated images based on product name
  const prompt = encodeURIComponent(`${productName} sweet candy confectionery food photography high quality`);
  return `https://image.pollinations.ai/prompt/${prompt}?width=400&height=400&seed=${Math.floor(Math.random() * 1000)}`;
};

// Sample data for development
const sampleSweets = [
  {
  name: 'ChocolateBrownie',
  category: 'Chocolate based',
  price: 249,
  quantity: 40,
  image: generateAIImageURL('ChocolateBrownie'),
  description: 'Rich, fudgy chocolate brownie with a dense texture and deep cocoa flavor. 🍫🤎'
},
{
  name: 'Cheesecake',
  category: 'Cake based',
  price: 299,
  quantity: 25,
  image: generateAIImageURL('Cheesecake'),
  description: 'Creamy baked dessert with a buttery biscuit base and smooth cheese filling. 🍰🤍'
},
{
  name: 'Cupcake',
  category: 'Cake based',
  price: 149,
  quantity: 50,
  image: generateAIImageURL('Cupcake'),
  description: 'Soft mini cake topped with fluffy frosting, perfect for a quick sweet bite. 🧁✨'
},
{
  name: 'Donut',
  category: 'Pastry based',
  price: 129,
  quantity: 60,
  image: generateAIImageURL('Donut'),
  description: 'Light and fluffy fried dough ring glazed with sugar or chocolate. 🍩💖'
},
{
  name: 'ChocolateMousse',
  category: 'Chocolate based',
  price: 219,
  quantity: 30,
  image: generateAIImageURL('ChocolateMousse'),
  description: 'Airy and smooth chocolate dessert that melts effortlessly on the tongue. 🍫🍨'
},
{
  name: 'Croissant',
  category: 'Pastry based',
  price: 179,
  quantity: 35,
  image: generateAIImageURL('Croissant'),
  description: 'Buttery, flaky pastry with delicate layers and a golden crust. 🥐🧈'
},
{
  name: 'Macaron',
  category: 'Pastry based',
  price: 269,
  quantity: 30,
  image: generateAIImageURL('Macaron'),
  description: 'Delicate almond meringue cookies with creamy fillings in vibrant flavors. 🌸🍬'
},
{
  name: 'Tiramisu',
  category: 'Cake based',
  price: 319,
  quantity: 20,
  image: generateAIImageURL('Tiramisu'),
  description: 'Classic Italian dessert layered with coffee-soaked sponge and mascarpone cream. ☕🍰'
},
{
  name: 'ChocolateTruffle',
  category: 'Chocolate based',
  price: 199,
  quantity: 45,
  image: generateAIImageURL('ChocolateTruffle'),
  description: 'Smooth chocolate ganache balls coated in cocoa, rich and indulgent. 🍫✨'
},
{
  name: 'IceCreamSundae',
  category: 'Frozen desserts',
  price: 229,
  quantity: 40,
  image: generateAIImageURL('IceCreamSundae'),
  description: 'Scoops of ice cream topped with sauces, nuts, and cherries. 🍨🍒'
},
{
  name: 'Gelato',
  category: 'Frozen desserts',
  price: 249,
  quantity: 35,
  image: generateAIImageURL('Gelato'),
  description: 'Italian-style ice cream with intense flavor and a silky smooth texture. 🇮🇹🍦'
},
{
  name: 'ApplePie',
  category: 'Pastry based',
  price: 279,
  quantity: 25,
  image: generateAIImageURL('ApplePie'),
  description: 'Classic baked pie filled with spiced apples and a flaky golden crust. 🥧🍎'
}
];

// Setup MongoDB
const setupDatabase = async () => {
  let mongoUri;
  
  if (MONGODB_URI) {
    // Use configured MongoDB URI (production or development)
    console.log(`📊 Using configured MongoDB...`);
    mongoUri = MONGODB_URI;
  } else {
    // Use in-memory MongoDB for development
    console.log('🔧 Starting in-memory MongoDB for development...');
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
  }
  
  return mongoUri;
};

// Seed database with sample data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Sweet.deleteMany({});
    await User.deleteMany({});
    
    // Create sample sweets
    await Sweet.insertMany(sampleSweets);
    console.log(`✅ Seeded ${sampleSweets.length} sample sweets`);
    
    // Create sample admin user
    await User.create({
      name: process.env.ADMIN_NAME || 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@sweetshop.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin'
    });
    
    // Create sample regular user
    await User.create({
      name: process.env.USER_NAME || 'John Customer',
      email: process.env.USER_EMAIL || 'user@sweetshop.com',
      password: process.env.USER_PASSWORD || 'user123',
      role: 'user'
    });
    
    console.log('✅ Created sample users:');
    console.log('   Admin: admin@sweetshop.com / admin123');
    console.log('   User:  user@sweetshop.com / user123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Start the application
const startServer = async () => {
  try {
    const mongoUri = await setupDatabase();
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Seed database with sample data
    await seedDatabase();
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🍭 ${process.env.APP_NAME || 'Sweet Shop Management System'} v${process.env.API_VERSION || '1.0.0'}`);
      console.log(`🍭 Backend Server running on port ${PORT}`);
      console.log(`🌐 Server listening on: http://${HOST}:${PORT}`);
      console.log(`📖 API Documentation: http://${HOST}:${PORT}`);
      console.log(`🍬 Test API: http://${HOST}:${PORT}/api/sweets`);
      console.log(`🔧 Environment: ${NODE_ENV}`);
      console.log('');
      console.log('🎯 Test Credentials:');
      console.log(`   Admin: ${process.env.ADMIN_EMAIL || 'admin@sweetshop.com'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
      console.log(`   User:  ${process.env.USER_EMAIL || 'user@sweetshop.com'} / ${process.env.USER_PASSWORD || 'user123'}`);
    });
    
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
    });
    
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();