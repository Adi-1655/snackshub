const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Settings = require('../models/Settings');
const AdminLog = require('../models/AdminLog');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      todayOrders,
      totalRevenue,
      todayRevenue,
      pendingOrders,
      lowStockProducts,
      totalUsers,
      totalProducts,
    ] = await Promise.all([
      Order.countDocuments({ orderStatus: 'Delivered' }),
      Order.countDocuments({ createdAt: { $gte: today }, orderStatus: 'Delivered' }),
      Order.aggregate([
        { $match: { orderStatus: 'Delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: today }, orderStatus: 'Delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments({ orderStatus: { $in: ['Pending', 'Confirmed'] } }),
      Product.countDocuments({ stock: { $lte: 5, $gt: 0 } }),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
    ]);

    const settings = await Settings.getSettings();

    res.json({
      success: true,
      data: {
        totalOrders,
        todayOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayRevenue: todayRevenue[0]?.total || 0,
        pendingOrders,
        lowStockProducts,
        totalUsers,
        totalProducts,
        orderingWindow: {
          start: settings.orderStartTime,
          end: settings.orderEndTime,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;

    let filter = {};
    if (status) filter.orderStatus = status;

    const orders = await Order.find(filter)
      .populate('user', 'name phone hostelName roomNumber')
      .populate('orderItems.product', 'name category')
      .sort('-createdAt')
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.orderStatus = status;

    if (status === 'Delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'Paid';
    }

    await order.save();

    // Log admin action
    await AdminLog.create({
      admin: req.user._id,
      action: 'UPDATE_ORDER_STATUS',
      description: `Updated order ${order._id} status to ${status}`,
      metadata: { orderId: order._id, newStatus: status },
    });

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create product
// @route   POST /api/admin/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    await AdminLog.create({
      admin: req.user._id,
      action: 'CREATE_PRODUCT',
      description: `Created product: ${product.name}`,
      metadata: { productId: product._id },
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await AdminLog.create({
      admin: req.user._id,
      action: 'UPDATE_PRODUCT',
      description: `Updated product: ${product.name}`,
      metadata: { productId: product._id },
    });

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await AdminLog.create({
      admin: req.user._id,
      action: 'DELETE_PRODUCT',
      description: `Deleted product: ${product.name}`,
      metadata: { productId: product._id },
    });

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get low stock products
// @route   GET /api/admin/products/low-stock
// @access  Private/Admin
exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $lte: 5, $gt: 0 } }).sort('stock');

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get sales report
// @route   GET /api/admin/sales-report/:range
// @access  Private/Admin
exports.getSalesReport = async (req, res) => {
  try {
    const { range } = req.params;
    let matchStage = { orderStatus: 'Delivered' }; // Only count delivered orders

    const now = new Date();

    if (range === 'daily') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      matchStage.createdAt = { $gte: startOfDay };
    } else if (range === 'weekly') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      matchStage.createdAt = { $gte: startOfWeek };
    } else if (range === 'monthly') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      matchStage.createdAt = { $gte: startOfMonth };
    } else if (range === 'yearly') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      matchStage.createdAt = { $gte: startOfYear };
    }

    const [orderStats, topProducts] = await Promise.all([
      Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: '$totalAmount' },
            avgOrderValue: { $avg: '$totalAmount' },
          },
        },
      ]),
      Order.aggregate([
        { $match: matchStage },
        { $unwind: '$orderItems' },
        {
          $group: {
            _id: '$orderItems.product',
            totalQuantity: { $sum: '$orderItems.quantity' },
            totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
          },
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const userStats = await User.countDocuments();

    res.json({
      success: true,
      data: {
        totalOrders: orderStats[0]?.totalOrders || 0,
        totalRevenue: Math.round(orderStats[0]?.totalRevenue || 0),
        avgOrderValue: Math.round(orderStats[0]?.avgOrderValue || 0),
        totalCustomers: userStats,
        topProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
