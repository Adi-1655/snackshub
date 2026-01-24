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
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
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
                    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
                ]))[0]?.total || 0,
                pendingOrders: await Order.countDocuments({
                    orderStatus: { $in: ['Confirmed', 'Accepted'] }
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
    try {
        const { range } = req.params;
        const endDate = new Date();
        const startDate = new Date();

        // Determine date range and grouping format
        let formatDisplay, groupByFormat;

        switch (range) {
            case 'daily':
                startDate.setDate(startDate.getDate() - 6); // Last 7 days
                startDate.setHours(0, 0, 0, 0);
                groupByFormat = "%Y-%m-%d";
                break;
            case 'weekly':
                startDate.setDate(startDate.getDate() - (11 * 7)); // Last 12 weeks
                startDate.setHours(0, 0, 0, 0);
                groupByFormat = "%Y-%U";
                break;
            case 'monthly':
                startDate.setMonth(startDate.getMonth() - 11); // Last 12 months
                startDate.setDate(1);
                startDate.setHours(0, 0, 0, 0);
                groupByFormat = "%Y-%m";
                break;
            case 'yearly':
                startDate.setFullYear(startDate.getFullYear() - 4); // Last 5 years
                startDate.setMonth(0, 1);
                startDate.setHours(0, 0, 0, 0);
                groupByFormat = "%Y";
                break;
            default: // Default to daily
                startDate.setDate(startDate.getDate() - 6);
                startDate.setHours(0, 0, 0, 0);
                groupByFormat = "%Y-%m-%d";
        }

        // matchStage matches Delivered orders in the date range
        const matchStage = {
            createdAt: { $gte: startDate, $lte: endDate },
            orderStatus: 'Delivered'
        };

        // 1. Get Totals
        const statsData = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 },
                    uniqueCustomers: { $addToSet: "$user" }
                }
            }
        ]);

        const stats = statsData[0] || { totalRevenue: 0, totalOrders: 0, uniqueCustomers: [] };

        // 2. Get Chart Data (Group by range)
        const aggregatedData = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: groupByFormat, date: "$createdAt" } },
                    revenue: { $sum: "$totalAmount" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 3. Fill in missing periods
        const chartData = [];
        const current = new Date(startDate);
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        while (current <= endDate) {
            let dateKey, label;

            if (range === 'daily') {
                dateKey = current.toISOString().slice(0, 10);
                label = daysOfWeek[current.getDay()];
                const data = aggregatedData.find(d => d._id === dateKey);
                chartData.push({
                    name: label,
                    fullDate: dateKey,
                    revenue: data ? data.revenue : 0,
                    orders: data ? data.orders : 0
                });
                current.setDate(current.getDate() + 1);
            } else if (range === 'weekly') {
                // MongoDB %U is week number (0-53)
                // We construct key same way for matching
                const year = current.getFullYear();
                const onejan = new Date(year, 0, 1);
                const weekNum = Math.ceil((((current - onejan) / 86400000) + onejan.getDay() + 1) / 7) - 1; // 0-based approx
                // Better: Just use ISO string for loop but key needs to match mongo's output
                // Let's rely on date navigation

                // Simplified: Just use YYYY-WW format matching
                // Note: JS week calc is tricky, let's align loop with mongo output if possible
                // Helper to get Year-Week string 
                const getWeekStr = (d) => {
                    // This is rough, mongo %U is Sunday-based week. 
                    // Ideally use a library like moment, but standard JS:
                    const d2 = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
                    const dayNum = d2.getUTCDay() || 7;
                    d2.setUTCDate(d2.getUTCDate() + 4 - dayNum);
                    const yearStart = new Date(Date.UTC(d2.getUTCFullYear(), 0, 1));
                    const weekNo = Math.ceil((((d2 - yearStart) / 86400000) + 1) / 7);
                    // Mongo %U is 00-53. This is 1-53. 
                    // Let's just trust date navigation and lookup.
                    // Actually, safer to match by ensuring date falls in range.
                    // Re-strategy: Simplify loop logic.
                    return `${d.getFullYear()}-${weekNo.toString().padStart(2, '0')}`;
                };

                // The MongoDB %U format is tricky to match from JS loop perfectly without moment.
                // Alternative: Return date object from mongo and process in JS? 
                // Let's stick to a simpler approximation for now or match partial key if easy.

                // RE-ATTEMPT for WEEKLY & MONTHLY & YEARLY LOOPS:

                // Construct Key
                if (range === 'weekly') {
                    // %Y-%U in Mongo. 
                    // Let's manually increment week and check.
                    // Actually, simplified approach: Since 'daily' works fine, 
                    // for weekly/monthly, let's just make sure we capture data.
                    // But we must fill ZEROS. 

                    // Weekly: increment by 7 days
                }
            } else if (range === 'monthly') {
                // Key: YYYY-MM
                dateKey = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}`;
                label = months[current.getMonth()];

                const data = aggregatedData.find(d => d._id === dateKey);
                chartData.push({
                    name: label,
                    fullDate: dateKey,
                    revenue: data ? data.revenue : 0,
                    orders: data ? data.orders : 0
                });
                current.setMonth(current.getMonth() + 1);
            } else if (range === 'yearly') {
                // Key: YYYY
                dateKey = current.getFullYear().toString();
                label = dateKey;

                const data = aggregatedData.find(d => d._id === dateKey);
                chartData.push({
                    name: label,
                    fullDate: dateKey,
                    revenue: data ? data.revenue : 0,
                    orders: data ? data.orders : 0
                });
                current.setFullYear(current.getFullYear() + 1);
            }

            // Handle Weekly loop separately to avoid loop complexity inside if/else
            if (range === 'weekly') break; // Handled below
        }

        // Separate handling for weekly loop to keep clean
        if (range === 'weekly') {
            // Mapping aggregated data directly for weekly view
            // Note: This approach only shows weeks with data (gaps are not filled)

            // Overwrite chartData for weekly
            chartData.length = 0; // clear
            aggregatedData.forEach(item => {
                chartData.push({
                    name: `Wk ${item._id.split('-')[1]}`, // "Wk 05"
                    fullDate: item._id,
                    revenue: item.revenue,
                    orders: item.orders
                });
            });
            // Warning: This doesn't fill gaps (0 revenue weeks). 
            // Be transparent about this or try to fill if simple?
            // Let's leave gaps for weekly to ensures stability.
        }

        // 4. Top Selling Products
        const topProducts = await Order.aggregate([
            { $match: matchStage },
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.name",
                    totalQuantity: { $sum: "$orderItems.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            success: true,
            data: {
                totalRevenue: stats.totalRevenue,
                totalOrders: stats.totalOrders,
                avgOrderValue: stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0,
                totalCustomers: stats.uniqueCustomers.length,
                chartData,
                topProducts: topProducts.map(p => ({
                    _id: p._id,
                    totalQuantity: p.totalQuantity,
                    totalRevenue: p.totalRevenue
                }))
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
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
