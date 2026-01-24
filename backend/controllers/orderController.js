const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { orderItems, deliveryDetails, paymentMethod, totalAmount } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
            return;
        } else {
            const order = new Order({
                user: req.user._id,
                orderItems,
                deliveryDetails,
                paymentMethod,
                totalAmount,
            });

            const createdOrder = await order.save();

            res.status(201).json({ success: true, data: createdOrder });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            // Check if user is order owner or admin
            if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
                res.json({ success: true, data: order });
            } else {
                res.status(401).json({ message: 'Not authorized' });
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }

            if (order.orderStatus !== 'Pending') {
                return res.status(400).json({ message: 'Cannot cancel order that is not pending' });
            }

            order.orderStatus = 'Cancelled';
            const updatedOrder = await order.save();
            res.json({ success: true, data: updatedOrder });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }

            if (order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled') {
                return res.status(400).json({ message: 'Cannot delete active order' });
            }

            await order.deleteOne();
            res.json({ success: true, message: 'Order removed' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrder,
    cancelOrder,
    deleteOrder,
};
