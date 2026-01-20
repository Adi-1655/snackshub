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
const upload = require('../middleware/uploadMiddleware');

// All routes require admin access
router.use(protect);
router.use(admin);

// Upload
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  // Construct URL (assuming server serves uploads folder)
  // The server.js has app.use('/uploads', express.static('uploads'));
  // So the URL path is just /uploads/filename
  const imageUrl = `/uploads/${req.file.filename}`;

  res.json({
    success: true,
    message: 'Image uploaded successfully',
    imageUrl: imageUrl
  });
});

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
