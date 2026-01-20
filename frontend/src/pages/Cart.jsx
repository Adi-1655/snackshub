import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, clearCart } = useApp();
  const navigate = useNavigate();

  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-[#a1a1a6] mb-6">
              Add some delicious snacks to get started!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-[#FACC15] text-black rounded-lg font-semibold hover:bg-[#f5c707] transition-all"
            >
              Browse Products
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Shopping Cart</h1>

        <div className="space-y-4">
          {cart.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-[#161616] border border-[#262626] rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:bg-[#1F1F1F] transition-all"
            >
              <div className="flex gap-4 flex-1">
                <img
                  src={item.image || '/placeholder-product.jpg'}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-base sm:text-lg text-white">{item.name}</h3>
                  <p className="text-xs sm:text-sm text-[#a1a1a6]">{item.category}</p>
                  <p className="text-base sm:text-lg font-bold text-[#FACC15] mt-1 sm:mt-2">
                    ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-0 border-[#262626] pt-3 sm:pt-0">
                <div className="flex items-center gap-2 bg-[#262626] rounded-lg p-1">
                  <button
                    onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                    className="p-1 sm:p-2 hover:bg-[#1F1F1F] rounded transition-colors text-[#a1a1a6]"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="font-bold w-6 sm:w-8 text-center text-white text-sm sm:text-base">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                    className="p-1 sm:p-2 hover:bg-[#1F1F1F] rounded transition-colors text-[#a1a1a6]"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-400 transition-colors p-2"
                >
                  <FiTrash2 className="text-lg sm:text-xl" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 bg-[#161616] border border-[#262626] rounded-xl p-6 hover:bg-[#1F1F1F] transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-white">Total Amount:</span>
            <span className="text-2xl font-bold text-[#FACC15]">₹{total}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={clearCart}
              className="w-full sm:flex-1 py-3 border-2 border-[#262626] text-[#a1a1a6] rounded-lg font-semibold hover:border-[#FACC15] hover:text-[#FACC15] transition-colors order-2 sm:order-1"
            >
              Clear Cart
            </button>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full sm:flex-1 py-3 bg-[#FACC15] text-black rounded-lg font-semibold hover:bg-[#f5c707] transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              <FiShoppingBag />
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
