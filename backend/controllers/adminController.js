const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Settings = require('../models/Settings');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const orders = await Order.countDocuments();
        const products = await Product.countDocuments();
        const users = await User.countDocuments();
        const totalSales = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);

        const settings = await Settings.findOne();


        res.json({
            success: true,
            data: {
                totalOrders: orders,
                products,
                users,
                totalRevenue: totalSales[0] ? totalSales[0].total : 0,

                lowStockProducts: await Product.countDocuments({
                    $or: [
                        { stock: { $lte: 5 } },
                        { countInStock: { $lte: 5 } }
                    ]
                }),
                todayOrders: await Order.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
                todayRevenue: (await Order.aggregate([
                    { $match: { createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } } },
                    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
                ]))[0]?.total || 0,
                pendingOrders: await Order.countDocuments({
                    status: { $regex: /^pending$/i } // Case insensitive
                }),
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.orderStatus = status;
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

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { name, price, image, brand, category, countInStock, stock, numReviews, description, maxQuantityPerOrder } = req.body;

        const product = new Product({
            name,
            price,
            user: req.user._id,
            image,
            brand,
            category,
            stock: stock || countInStock || 0,
            numReviews: 0,
            description,
            maxQuantityPerOrder: maxQuantityPerOrder || 5
        });

        const createdProduct = await product.save();
        res.status(201).json({ success: true, data: createdProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const { name, price, description, image, brand, category, stock, maxQuantityPerOrder, isAvailable } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price !== undefined ? price : product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.brand = brand || product.brand;
            product.category = category || product.category;
            product.stock = stock !== undefined ? stock : product.stock;
            product.maxQuantityPerOrder = maxQuantityPerOrder !== undefined ? maxQuantityPerOrder : product.maxQuantityPerOrder;
            product.isAvailable = isAvailable !== undefined ? isAvailable : product.isAvailable;

            const updatedProduct = await product.save();
            res.json({ success: true, data: updatedProduct });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get low stock products
// @route   GET /api/admin/products/low-stock
// @access  Private/Admin
const getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.find({ stock: { $lte: 5 } });
        res.json({ success: true, data: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get sales report
// @route   GET /api/admin/sales-report/:range
// @access  Private/Admin
const getSalesReport = async (req, res) => {
    // Basic stub
    res.json({ message: 'Sales report endpoint' });
};

module.exports = {
    getDashboardStats,
    getAllOrders,
    updateOrderStatus,
    createProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    getSalesReport,
};
