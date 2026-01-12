const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Settings = require('../models/Settings');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

exports.createOrder = async (req, res, next) => {
  try {
    // your existing order creation logic here
    const { orderItems, deliveryDetails, paymentMethod, notes } = req.body;

    console.log('Create order request:', { orderItems, deliveryDetails, paymentMethod });

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided',
      });
    }

    const settings = await Settings.getSettings();

    // Validate and process order items
    let totalAmount = 0;
    const processedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`,
        });
      }

      if (!product.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is currently unavailable`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      if (item.quantity > product.maxQuantityPerOrder) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${product.maxQuantityPerOrder} units allowed for ${product.name}`,
        });
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();

      processedItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        image: product.image,
      });

      totalAmount += product.price * item.quantity;
    }

    // Check minimum order amount
    if (totalAmount < settings.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is ₹${settings.minOrderAmount}`,
      });
    }

    // Add delivery charge
    totalAmount += settings.deliveryCharge;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems: processedItems,
      deliveryDetails: deliveryDetails || {
        hostelName: req.user.hostelName,
        roomNumber: req.user.roomNumber,
        phone: req.user.phone,
      },
      paymentMethod: paymentMethod || 'COD',
      totalAmount,
      notes,
    });

    // Update user order count
    const today = new Date().toDateString();
    const lastOrderDate = req.user.lastOrderDate ? new Date(req.user.lastOrderDate).toDateString() : null;

    if (today !== lastOrderDate) {
      req.user.orderCount = 1;
    } else {
      req.user.orderCount += 1;
    }
    req.user.lastOrderDate = new Date();
    await req.user.save();

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name category')
      .sort('-createdAt');

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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name phone hostelName roomNumber')
      .populate('orderItems.product', 'name category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Ensure user can only view their own orders (unless admin)
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    // Check if order can be cancelled
    if (!order.isCancellable) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage',
      });
    }

    // Restore stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = 'Cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = req.body.reason || 'Cancelled by user';
    order.isCancellable = false;

    await order.save();

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
