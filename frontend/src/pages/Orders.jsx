import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { orderAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getUserOrders();
      setOrders(data.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await orderAPI.cancel(orderId, 'Cancelled by user');
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <FiClock className="text-yellow-500" />;
      case 'Confirmed':
      case 'Preparing':
        return <FiPackage className="text-blue-500" />;
      case 'Out for Delivery':
        return <FiTruck className="text-purple-500" />;
      case 'Delivered':
        return <FiCheckCircle className="text-green-500" />;
      case 'Cancelled':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#FACC15]/20 text-[#FACC15]';
      case 'Confirmed':
      case 'Preparing':
        return 'bg-blue-500/20 text-blue-400';
      case 'Out for Delivery':
        return 'bg-purple-500/20 text-purple-400';
      case 'Delivered':
        return 'bg-green-500/20 text-green-400';
      case 'Cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-[#262626] text-[#a1a1a6]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#FACC15]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              No orders yet
            </h3>
            <p className="text-[#a1a1a6]">
              Start ordering delicious snacks!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#161616] border border-[#262626] rounded-xl overflow-hidden hover:bg-[#1F1F1F] transition-all"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-[#71717A]">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-[#71717A]">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.orderStatus)}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.orderItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between text-sm text-[#a1a1a6]"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-semibold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#262626] pt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-[#71717A]">Total Amount</p>
                      <p className="text-2xl font-bold text-[#FACC15]">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                    {order.isCancellable && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>

                  <div className="mt-4 p-4 bg-[#0A0A0A] border border-[#262626] rounded-lg">
                    <p className="text-sm font-medium text-[#a1a1a6] mb-2">
                      Delivery Details
                    </p>
                    <p className="text-sm text-[#71717A]">
                      {order.deliveryDetails.hostelName} - Room {order.deliveryDetails.roomNumber}
                    </p>
                    <p className="text-sm text-[#71717A]">
                      {order.deliveryDetails.phone}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
