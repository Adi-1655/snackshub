const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getSalesReport,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// All routes require admin access
router.use(protect);
router.use(admin);

// Dashboard
router.get('/stats', getDashboardStats);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Products
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/products/low-stock', getLowStockProducts);

// Reports
router.get('/sales-report/:range', getSalesReport);

module.exports = router;
