import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiHome, FiPhone, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import BackButton from '../components/BackButton';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [deliveryDetails, setDeliveryDetails] = useState({
    hostelName: user?.hostelName || '',
    roomNumber: user?.roomNumber || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setDeliveryDetails(prev => ({
        ...prev,
        hostelName: prev.hostelName || user.hostelName || '',
        roomNumber: prev.roomNumber || user.roomNumber || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    // Redirect to cart if empty
    if (cart.length === 0 && !orderSuccess) {
      navigate('/cart', { replace: true });
    }
  }, [cart, navigate, orderSuccess]);

  const total = getCartTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        orderItems: cart.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        })),
        deliveryDetails,
        paymentMethod,
        totalAmount: total,
      };

      console.log('Sending order data:', orderData);
      console.log('Cart items:', cart);

      const response = await orderAPI.create(orderData);
      console.log('Order response:', response);

      if (response.data.success) {
        setOrderSuccess(true);
        clearCart();
        toast.success('Order placed successfully!');

        // Navigate after delay
        const timer = setTimeout(() => {
          navigate('/orders', { replace: true });
        }, 3000);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("RAW DATA:", error.response?.data);
      console.log(
        "STRINGIFIED DATA:",
        JSON.stringify(error.response?.data, null, 2)
      );

      const errorData = error.response?.data;
      const errorMessage = errorData?.message || error.message || 'Order placement failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] transition-colors duration-300 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiCheck className="text-white text-5xl" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-[#a1a1a6] mb-6">
            Redirecting to orders page...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] transition-colors duration-300 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <BackButton to="/cart" label="Back to Cart" />
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 hover:bg-[#1F1F1F] transition-all">
              <h2 className="text-xl font-bold text-white mb-4">
                Delivery Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                    Hostel Name
                  </label>
                  <div className="relative">
                    <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#71717A]" />
                    <input
                      type="text"
                      value={deliveryDetails.hostelName}
                      onChange={(e) =>
                        setDeliveryDetails({ ...deliveryDetails, hostelName: e.target.value })
                      }
                      required
                      className="w-full pl-10 pr-4 py-3 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:ring-2 focus:ring-[#FACC15] focus:border-[#FACC15]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={deliveryDetails.roomNumber}
                    onChange={(e) =>
                      setDeliveryDetails({ ...deliveryDetails, roomNumber: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:ring-2 focus:ring-[#FACC15] focus:border-[#FACC15]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#71717A]" />
                    <input
                      type="tel"
                      value={deliveryDetails.phone}
                      onChange={(e) =>
                        setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })
                      }
                      required
                      className="w-full pl-10 pr-4 py-3 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:ring-2 focus:ring-[#FACC15] focus:border-[#FACC15]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 hover:bg-[#1F1F1F] transition-all">
              <h2 className="text-xl font-bold text-white mb-4">
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-[#262626] rounded-lg cursor-pointer hover:border-[#FACC15] transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5"
                  />
                  <FiDollarSign className="text-xl text-[#a1a1a6]" />
                  <span className="font-medium text-white">
                    Cash on Delivery
                  </span>
                </label>
                <label className="flex items-center gap-3 p-4 border-2 border-[#262626] rounded-lg cursor-pointer hover:border-[#FACC15] transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5"
                  />
                  <FiCreditCard className="text-xl text-[#a1a1a6]" />
                  <span className="font-medium text-white">UPI (Mock)</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 sticky top-24 hover:bg-[#1F1F1F] transition-all">
              <h2 className="text-xl font-bold text-white mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-[#a1a1a6]">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold text-white">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#262626] pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-[#FACC15]">
                    ₹{total}
                  </span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#FACC15] text-black rounded-lg font-semibold hover:bg-[#f5c707] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
