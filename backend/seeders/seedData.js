const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Settings = require('../models/Settings');

dotenv.config();

const products = [
  // Chips
  {
    name: 'Lays Classic Salted',
    category: 'Chips',
    price: 20,
    stock: 50,
    brand: 'Lays',
    weight: '52g',
    description: 'Indias favourite potato chips',
    image: '/uploads/lays-classic.jpg',
    isAvailable: true,
    maxQuantityPerOrder: 5,
  },
  {
    name: 'Kurkure Masala Munch',
    category: 'Chips',
    price: 20,
    stock: 45,
    brand: 'Kurkure',
    weight: '82g',
    description: 'Crunchy and spicy snack',
    image: '/uploads/kurkure.jpg',
    isAvailable: true,
    maxQuantityPerOrder: 5,
  },
  {
    name: 'Bingo Mad Angles',
    category: 'Chips',
    price: 10,
    stock: 3,
    brand: 'Bingo',
    weight: '36g',
    description: 'Triangular shaped spicy chips',
    image: '/uploads/bingo.jpg',
    isAvailable: true,
    maxQuantityPerOrder: 5,
  },

  // Biscuits
  {
    name: 'Parle-G Gold',
    category: 'Biscuits',
    price: 10,
    stock: 100,
    brand: 'Parle',
    weight: '100g',
    description: 'Indias original glucose biscuit',
    image: '/uploads/parle-g.jpg',
    isAvailable: true,
    maxQuantityPerOrder: 10,
  },
  {
    name: 'Oreo Original',
    category: 'Biscuits',
    price: 30,
    stock: 40,
    brand: 'Oreo',
    weight: '120g',
    description: 'Chocolate sandwich cookies',
    image: '/uploads/oreo.jpg',
    isAvailable: true,
    maxQuantityPerOrder: 5,
  },
  {
    name: 'Good Day Butter',
    category: 'Biscuits',
    price: 25,
    stock: 35,
    brand: 'Britannia',
    weight: '100g',
    description: 'Delicious butter cookies',
    image: '/uploads/goodday.jpg',
    isAvailable: true,
    maxQuantityPerOrder: 5,
  },

  // Chocolates
  {
    name: 'Dairy Milk',
    category: 'Chocolates',
    price: 35,
    stock: 60,
    brand: 'Cadbury',
    weight: '38g',
    description: 'Smooth milk chocolate',
    image: '/uploads/dairymilk.jpg',
    isAvailable: true,
    maxQuantityPerOrder: 5,
  },
  {
    name: 'KitKat',
    category: 'Chocolates',
    price: 20,
    stock: 50,
    brand: 'Nestle',
    weight: '27g',
    description: 'Crispy wafer chocolate',
    image: '/uploads/kitkat.jpg',
    isAvailable: true,
    maxQuantityPerOrder: 5,
  },
  {
    name: '5 Star',
    category: 'Chocolates',
    price: 10,
    stock: 70,
    brand: 'Cadbury',
    weight: '22g',
    description: 'Chocolate caramel nougat',
    image: '/uploads/5star.jpg',
    isAvailable: true,
    maxQuantityPerOrder: 10,
  },

  // Cold Drinks
  {
    name: 'Coca Cola',
    category: 'Cold Drinks',
    price: 40,
    stock: 48,
    brand: 'Coca Cola',
    weight: '600ml',
    description: 'Refreshing cola drink',
    image: '/uploads/coke.jpg',
    isAvailable: true,
    maxQuantityPerOrder: 3,
  },
  {
    name: 'Sprite',
    category: 'Cold Drinks',
    price: 40,
    stock: 45,
    brand: 'Coca Cola',
    weight: '600ml',
    description: 'Lemon lime soda',
    image: '/uploads/sprite.jpg',
    isAvailable: true,
    maxQuantityPerOrder: 3,
  },
  {
    name: 'Thumbs Up',
    category: 'Cold Drinks',
    price: 20,
    stock: 2,
    brand: 'Coca Cola',
    weight: '300ml',
    description: 'Strong cola taste',
    image: '/uploads/thumbsup.jpg',
    isAvailable: true,
    maxQuantityPerOrder: 3,
  },

  // Instant Noodles
  {
    name: 'Maggi Masala',
    category: 'Instant Noodles',
    price: 14,
    stock: 80,
    brand: 'Maggi',
    weight: '70g',
    description: '2-minute instant noodles',
    image: '/uploads/maggi.jpg',
    isAvailable: true,
    maxQuantityPerOrder: 10,
  },
  {
    name: 'Yippee Noodles',
    category: 'Instant Noodles',
    price: 12,
    stock: 60,
    brand: 'Sunfeast',
    weight: '65g',
    description: 'Tasty instant noodles',
    image: '/uploads/yippee.jpg',
    isAvailable: true,
    maxQuantityPerOrder: 10,
  },
  {
    name: 'Top Ramen',
    category: 'Instant Noodles',
    price: 15,
    stock: 55,
    brand: 'Nissin',
    weight: '75g',
    description: 'Curry flavored noodles',
    image: '/uploads/topramen.jpg',
    isAvailable: true,
    maxQuantityPerOrder: 10,
  },
];

const users = [
  {
    name: 'Admin User',
    phone: '9999999999',
    hostelId: 'ADMIN001',
    hostelName: 'Admin Block',
    roomNumber: '000',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Rahul Kumar',
    phone: '9876543210',
    hostelId: 'HST001',
    hostelName: 'Boys Hostel A',
    roomNumber: '101',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Priya Sharma',
    phone: '9876543211',
    hostelId: 'HST002',
    hostelName: 'Girls Hostel B',
    roomNumber: '205',
    password: 'password123',
    role: 'user',
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Settings.deleteMany();
    console.log('🗑️  Cleared existing data...');

    // Insert users
    await User.create(users);
    console.log('👥 Users created...');

    // Insert products
    await Product.create(products);
    console.log('📦 Products created...');

    // Create settings
    await Settings.create({
      orderStartTime: '08:00',
      orderEndTime: '23:30',
      maxOrdersPerDay: 3,
      maxItemsPerOrder: 10,
      deliveryCharge: 0,
      minOrderAmount: 0,
      isOrderingEnabled: true,
      maintenanceMode: false,
    });
    console.log('⚙️  Settings created...');

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('Admin - Phone: 9999999999, Password: admin123');
    console.log('User 1 - Phone: 9876543210, Password: password123');
    console.log('User 2 - Phone: 9876543211, Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
