# 🎯 FINAL STEPS TO RUN THE PROJECT

## ✅ What's Been Created

Your Hostel Snack Ordering System is now fully set up with:

### Backend (Node.js + Express + MongoDB)
- ✅ Complete REST API with all endpoints
- ✅ JWT authentication system
- ✅ MongoDB models (Users, Products, Orders, Settings, AdminLogs)
- ✅ Middleware for auth and order validation
- ✅ Time-based ordering restrictions
- ✅ Stock management system
- ✅ Admin functionality
- ✅ Database seeder with demo data

### Frontend (React + Tailwind + Framer Motion)
- ✅ Login/Register pages with validation
- ✅ Home page with product catalog
- ✅ Shopping cart with quantity management
- ✅ Checkout page with order placement
- ✅ Orders page with tracking
- ✅ Admin Dashboard with analytics
- ✅ Dark mode support
- ✅ Smooth animations
- ✅ Mobile-responsive design
- ✅ Toast notifications

## 🚀 TO RUN THE PROJECT (3 SIMPLE STEPS)

### Step 1: Start MongoDB
Make sure MongoDB is running on your system.

### Step 2: Start Backend (Terminal 1)
```powershell
cd backend
npm run seed    # First time only - creates demo data
npm run dev     # Starts server on port 5000
```

### Step 3: Start Frontend (Terminal 2 - New Window)
```powershell
cd frontend
npm run dev     # Starts on port 5173
```

### Step 4: Open Browser
Navigate to: **http://localhost:5173**

## 🔑 LOGIN CREDENTIALS

### 👨‍💼 Admin Account
- Phone: **9999999999**
- Password: **admin123**

### 👤 Test User
- Phone: **9876543210**  
- Password: **password123**

## 📱 WHAT YOU CAN DO

### As a User:
1. **Browse Products** - View all snacks by category
2. **Add to Cart** - Select items and quantities
3. **Place Orders** - Checkout with delivery details
4. **Track Orders** - View order status in real-time
5. **Cancel Orders** - Cancel before preparation starts
6. **Toggle Dark Mode** - Switch themes

### As an Admin:
1. **View Dashboard** - See total orders, revenue, low stock alerts
2. **Manage Orders** - Update order status (Pending → Confirmed → Preparing → Out for Delivery → Delivered)
3. **View Products** - See all products with stock levels
4. **Update Settings** - Change ordering time window

## ⏰ TIME-BASED ORDERING FEATURE

- Orders are **ONLY allowed between 8:00 AM - 11:00 PM** (configurable)
- Outside this window:
  - "Add to Cart" buttons are disabled
  - A banner shows when ordering will be available
  - Admin can change these times in Settings

## 🎨 UI FEATURES

- **Mobile-First Design** - Works perfectly on phones
- **Dark Mode** - Auto-saved preference
- **Animations** - Smooth transitions with Framer Motion
- **Skeleton Loaders** - Better loading experience
- **Toast Notifications** - Real-time feedback
- **Low Stock Badges** - Yellow badges for items with ≤5 stock
- **Gradient Buttons** - Modern, attractive UI

## 📊 BUSINESS LOGIC

1. **Stock Management**
   - Auto-deduction when order is placed
   - Restoration when order is cancelled
   - Low stock alerts (≤5 items)

2. **Order Limits**
   - Max 3 orders per day per user
   - Max 10 items per order
   - Max quantity per product (configurable)

3. **Order Workflow**
   - Pending → Confirmed → Preparing → Out for Delivery → Delivered
   - Can cancel only in "Pending" or "Confirmed" status

4. **Payment Methods**
   - Cash on Delivery (COD)
   - UPI (Mock - for demo)

## 🗂️ PROJECT STRUCTURE

```
MasterMinds/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── settingsController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── orderValidation.js
│   ├── models/
│   │   ├── AdminLog.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Settings.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── settingsRoutes.js
│   ├── seeders/seedData.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── SkeletonCard.jsx
    │   ├── context/
    │   │   ├── AppContext.jsx
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   └── Orders.jsx
    │   ├── utils/api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── tailwind.config.js
    ├── vite.config.js
    ├── package.json
    └── .env
```

## 🔧 ENVIRONMENT FILES

### Backend `.env` (already created)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/hostel_snacks
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
```

### Frontend `.env` (already created)
```
VITE_API_URL=http://localhost:5000/api
```

## 🧪 TESTING SCENARIOS

1. **User Registration & Login**
   - Register new account
   - Login with credentials
   - Auto-redirect to home page

2. **Browse & Shop**
   - Filter by category
   - View product details
   - Add/remove from cart
   - Update quantities

3. **Order Flow**
   - Place order
   - View in My Orders
   - Track status updates (as admin)
   - Cancel order (if allowed)

4. **Time Restrictions**
   - Try ordering outside 8 AM - 11 PM
   - See disabled buttons and banner
   - Change times as admin

5. **Stock Management**
   - Order product until stock is low
   - See low stock badge
   - Try ordering out-of-stock item

6. **Admin Functions**
   - View dashboard stats
   - Update order status
   - View products
   - Change ordering hours

## 🎁 SAMPLE DATA (After Seeding)

### Products (15 items):
- **Chips:** Lays, Kurkure, Bingo
- **Biscuits:** Parle-G, Oreo, Good Day
- **Chocolates:** Dairy Milk, KitKat, 5 Star
- **Cold Drinks:** Coca Cola, Sprite, Thumbs Up
- **Noodles:** Maggi, Yippee, Top Ramen

### Users (3 accounts):
- Admin (phone: 9999999999)
- Test User 1 (phone: 9876543210)
- Test User 2 (phone: 9876543211)

## 📝 API ENDPOINTS

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get single product
- GET `/api/products/categories/list` - Get categories

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders` - Get user orders
- GET `/api/orders/:id` - Get single order
- PUT `/api/orders/:id/cancel` - Cancel order

### Admin
- GET `/api/admin/stats` - Dashboard stats
- GET `/api/admin/orders` - All orders
- PUT `/api/admin/orders/:id/status` - Update order status
- POST `/api/admin/products` - Create product
- PUT `/api/admin/products/:id` - Update product
- DELETE `/api/admin/products/:id` - Delete product

### Settings
- GET `/api/settings` - Get settings
- PUT `/api/settings` - Update settings (admin only)
- GET `/api/settings/check-ordering` - Check if ordering is allowed

## 🚨 IMPORTANT NOTES

1. **MongoDB Required** - Make sure MongoDB is installed and running
2. **Port Conflicts** - Ensure ports 5000 and 5173 are free
3. **Environment Variables** - Don't commit `.env` files to Git
4. **Production** - Change JWT_SECRET before deploying
5. **Images** - Product images use placeholder URLs (can be updated later)

## 🎉 YOU'RE ALL SET!

Your complete hostel snack ordering system is ready to run. Follow the 3 steps above and start exploring all the features!

For detailed documentation, see:
- `README.md` - Complete project documentation
- `QUICKSTART.md` - Quick start guide

---

**Built with ❤️ for hostel students**
**Stack: React + Node.js + Express + MongoDB + Tailwind CSS**
