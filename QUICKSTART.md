# 🚀 Quick Start Guide - Hostel Snack Ordering System

## Prerequisites
- Node.js (v16+)
- MongoDB (running locally or MongoDB Atlas)
- Git

## Step 1: Install Backend Dependencies

```powershell
cd backend
npm install
```

## Step 2: Configure Backend Environment

The `.env` file is already created in the backend folder. Make sure MongoDB is running:

**For local MongoDB:**
- The default connection string is: `mongodb://localhost:27017/hostel_snacks`
- Make sure MongoDB service is running

**For MongoDB Atlas:**
- Update `MONGO_URI` in `backend/.env` with your Atlas connection string

## Step 3: Seed the Database

```powershell
npm run seed
```

This will create:
- ✅ Sample products (Chips, Biscuits, Chocolates, Cold Drinks, Noodles)
- ✅ Admin account (Phone: 9999999999, Password: admin123)
- ✅ Test user accounts
- ✅ System settings (ordering time: 8 AM - 11 PM)

## Step 4: Start Backend Server

```powershell
npm run dev
```

Backend will run on: **http://localhost:5000**

## Step 5: Install Frontend Dependencies

Open a new terminal window:

```powershell
cd frontend
npm install
```

## Step 6: Start Frontend Server

```powershell
npm run dev
```

Frontend will run on: **http://localhost:5173**

## 🎉 Access the Application

Open your browser and go to: **http://localhost:5173**

## 🔑 Login Credentials

### Admin Login
- **Phone:** 9999999999
- **Password:** admin123
- Access admin dashboard from the navbar after login

### Regular User Login
- **Phone:** 9876543210
- **Password:** password123

Or register a new account!

## 📱 Testing the Application

### As a User:
1. Login with user credentials
2. Browse products by category
3. Add items to cart
4. Proceed to checkout
5. Place an order
6. View order status in "My Orders"
7. Try cancelling an order (only works if status is "Pending")

### As an Admin:
1. Login with admin credentials
2. View dashboard statistics
3. Manage orders and update status
4. View products and stock levels
5. Update system settings (ordering hours)

## 🕒 Time-Based Ordering

- Orders are only allowed between **8:00 AM - 11:00 PM** (default)
- This can be changed from Admin Dashboard → Settings
- Outside these hours, "Add to Cart" buttons are disabled
- A banner shows when ordering is closed

## 🌙 Dark Mode

- Toggle dark mode from the navbar
- Preference is saved in localStorage

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```powershell
# Make sure MongoDB is running
# Windows: Check Services for MongoDB
# Or start manually:
mongod
```

**Port 5000 already in use:**
- Change `PORT` in `backend/.env` to another port (e.g., 5001)
- Update `VITE_API_URL` in `frontend/.env` accordingly

### Frontend Issues

**API Connection Error:**
- Make sure backend is running
- Check `VITE_API_URL` in `frontend/.env` matches backend URL

**Blank Page:**
- Check browser console for errors
- Make sure all npm packages are installed

## 📦 Project Structure

```
MasterMinds/
├── backend/          # Express API server
│   ├── config/       # Database configuration
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Auth & validation
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API routes
│   └── seeders/      # Database seed data
│
└── frontend/         # React application
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── context/     # Context API (State)
    │   ├── pages/       # Page components
    │   └── utils/       # API utilities
    └── public/
```

## 🎨 Features Implemented

✅ User authentication & registration  
✅ Product catalog with categories  
✅ Shopping cart functionality  
✅ Order placement & tracking  
✅ Time-based ordering restrictions  
✅ Admin dashboard with analytics  
✅ Order management (status updates)  
✅ Product management  
✅ Settings management  
✅ Dark mode support  
✅ Responsive mobile-first design  
✅ Smooth animations (Framer Motion)  
✅ Toast notifications  
✅ Skeleton loaders  
✅ Low stock alerts  
✅ Order cancellation  

## 🔧 Common Commands

### Backend
```powershell
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
```

### Frontend
```powershell
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🚀 Next Steps (Optional Enhancements)

- [ ] Add product image upload functionality
- [ ] Implement real UPI payment integration
- [ ] Add order notifications via email/SMS
- [ ] Create analytics charts for admin
- [ ] Add product reviews and ratings
- [ ] Implement wishlist functionality
- [ ] Add search functionality
- [ ] Create mobile app version

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all environment variables are correct
3. Ensure MongoDB is running
4. Check console logs for error messages

---

**Happy Coding! 🎉**
