# Hostel Snack Ordering System

A modern, full-stack web application for hostel students to order snacks online with a configurable time window. Built with React, Node.js, Express, MongoDB, and Tailwind CSS.

## 🚀 Features

### User Features
- 📱 Mobile-first responsive design
- 🔐 Secure authentication (JWT-based)
- 🛒 Shopping cart with real-time updates
- ⏰ Time-based ordering restrictions (8 AM - 11 PM, configurable)
- 📦 Order tracking with status updates
- 🌙 Dark mode support
- 💳 Multiple payment methods (COD, UPI)
- ✨ Smooth animations with Framer Motion
- 🔔 Toast notifications

### Admin Features
- 📊 Dashboard with analytics
- 📦 Product management (Add/Edit/Delete)
- 📋 Order management and status updates
- ⚙️ System settings (ordering hours, limits)
- 📉 Low stock alerts
- 👥 User management

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing
- **Axios** - API calls
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend folder:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Configure environment variables:
   - Edit \`.env\` file with your MongoDB URI and other settings

4. Seed the database:
\`\`\`bash
npm run seed
\`\`\`

5. Start the server:
\`\`\`bash
npm run dev
# or
npm start
\`\`\`

Server runs on: http://localhost:5000

### Frontend Setup

1. Navigate to frontend folder:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start development server:
\`\`\`bash
npm run dev
\`\`\`

Frontend runs on: http://localhost:5173

## 🔑 Demo Credentials

### Admin Access
- **Phone:** 9999999999
- **Password:** admin123

### User Access
- **Phone:** 9876543210
- **Password:** password123

## 📁 Project Structure

\`\`\`
MasterMinds/
├── backend/
│   ├── config/
│   │   └── db.js
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
│   ├── seeders/
│   │   └── seedData.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
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
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
\`\`\`

## 🎯 Key Features Explained

### Time-Based Ordering
Orders are only allowed between configurable hours (default: 8 AM - 11 PM). The system checks:
- Current time against settings
- Displays banners when ordering is closed
- Disables "Add to Cart" buttons outside hours

### Stock Management
- Auto-deduction on order placement
- Stock restoration on order cancellation
- Low stock alerts for admin
- Per-product quantity limits

### Order Workflow
1. **Pending** - Order placed
2. **Confirmed** - Admin confirmed
3. **Preparing** - Being prepared (non-cancellable)
4. **Out for Delivery** - On the way
5. **Delivered** - Completed
6. **Cancelled** - Cancelled by user/admin

### Security
- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes
- Role-based access control

## 🎨 UI/UX Highlights

- **Mobile-First Design** - Optimized for mobile devices
- **Dark Mode** - Toggle between light and dark themes
- **Smooth Animations** - Framer Motion for transitions
- **Skeleton Loaders** - Better loading experience
- **Toast Notifications** - Real-time feedback
- **Gradient Buttons** - Modern UI elements
- **Card-Based Layout** - Clean and organized

## 📝 API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
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
- PUT `/api/settings` - Update settings
- GET `/api/settings/check-ordering` - Check if ordering is allowed

## 🔧 Configuration

### Backend (.env)
\`\`\`
PORT=5000
MONGO_URI=mongodb://localhost:27017/hostel_snacks
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
\`\`\`

### Frontend (.env)
\`\`\`
VITE_API_URL=http://localhost:5000/api
\`\`\`

## 🚀 Deployment

### Backend
1. Set environment variables on hosting platform
2. Ensure MongoDB is accessible
3. Run \`npm install\` and \`npm start\`

### Frontend
1. Build the project: \`npm run build\`
2. Deploy the \`dist\` folder to hosting platform
3. Configure environment variable for API URL

## 📱 Screenshots

(Add screenshots of your application here)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Developer

Built with ❤️ for hostel students

---

**Note:** This is a demo application for educational purposes. For production use, add additional security measures, error handling, and testing.
