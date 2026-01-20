import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { orderAPI, adminAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ORDER_STEPS = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

const OrderTracker = ({ currentStatus }) => {
  if (currentStatus === 'Cancelled') {
    return (
      <div className="w-full py-4 bg-red-500/10 rounded-lg border border-red-500/20 mb-4 flex items-center justify-center gap-2 text-red-500">
        <FiXCircle />
        <span className="font-medium">Order Cancelled</span>
      </div>
    );
  }

  const currentIndex = ORDER_STEPS.indexOf(currentStatus);

  return (
    <div className="w-full py-6 px-2">
      <div className="relative flex justify-between">
        {/* Progress Bar Background */}
        <div className="absolute top-2 left-0 w-full h-1 bg-[#262626] -z-10 rounded-full" />

        {/* Active Progress Bar */}
        <div
          className="absolute top-2 left-0 h-1 bg-[#FACC15] -z-10 transition-all duration-500 rounded-full"
          style={{ width: `${(currentIndex / (ORDER_STEPS.length - 1)) * 100}%` }}
        />

        {ORDER_STEPS.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step} className="flex flex-col items-center group relative">
              <div
                className={`w-5 h-5 rounded-full border-4 transition-colors duration-300 z-10 ${isCompleted
                  ? 'bg-[#FACC15] border-[#FACC15]'
                  : 'bg-[#161616] border-[#262626]'
                  }`}
              />
              <span
                className={`absolute top-6 text-[10px] sm:text-xs whitespace-nowrap transition-colors ${isCurrent || isCompleted ? 'text-[#FACC15] font-medium' : 'text-[#52525B]'
                  }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      if (user?.role === 'admin') {
        const { data } = await adminAPI.getAllOrders();
        // Filter only pending orders for admin view
        const pendingOrders = data.data
          .filter(order => order.orderStatus === 'Pending')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(pendingOrders);
      } else {
        const { data } = await orderAPI.getUserOrders();
        setOrders(data.data);
      }
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

  const toggleTracking = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
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
        <h1 className="text-3xl font-bold text-white mb-6">
          {user?.role === 'admin' ? 'Pending Orders' : 'My Orders'}
        </h1>

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
                onClick={() => {
                  if (user?.role === 'admin') {
                    navigate('/admin', { state: { activeTab: 'orders' } });
                  }
                }}
                className={`bg-[#161616] border border-[#262626] rounded-xl overflow-hidden transition-all ${user?.role === 'admin'
                  ? 'cursor-pointer hover:border-[#FACC15] hover:shadow-lg hover:shadow-yellow-500/10'
                  : 'hover:bg-[#1F1F1F]'
                  }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-sm text-[#71717A]">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-[#71717A]">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {/* Status Badge & Track Button */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                      {order.orderStatus !== 'Cancelled' && (
                        <button
                          onClick={() => toggleTracking(order._id)}
                          className="text-sm text-[#FACC15] hover:text-[#f5c707] hover:underline transition-colors font-medium border border-[#FACC15] rounded-lg px-3 py-1 hover:bg-[#FACC15] hover:text-black"
                        >
                          {expandedOrders.has(order._id) ? 'Hide Tracking' : 'Track Order'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tracker Component - Conditionally Rendered */}
                  {expandedOrders.has(order._id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-8"
                    >
                      <OrderTracker currentStatus={order.orderStatus} />
                    </motion.div>
                  )}

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
                    {order.isCancellable && order.orderStatus === 'Pending' && (
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
