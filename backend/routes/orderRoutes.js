const express = require('express');
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getOrder,
  cancelOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { checkOrderingTime, checkOrderLimit } = require('../middleware/orderValidation');

// Create a new order
router.post('/', protect, checkOrderingTime, checkOrderLimit, createOrder);

// Fetch orders for the logged-in user
router.get('/', protect, getUserOrders);

// Fetch a single order (must belong to the user unless admin)
router.get('/:id', protect, getOrder);

// Cancel an order
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
