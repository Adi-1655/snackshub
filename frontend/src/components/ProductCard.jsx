import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiMinus, FiPlus, FiZap } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/api';

const ProductCard = ({ product }) => {
  const { addToCart, cart, isOrderingAllowed, updateCartQuantity, removeFromCart, settings } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const cartItem = cart.find((item) => item._id === product._id);

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isDisabled = !product.isAvailable || isOutOfStock || !isOrderingAllowed;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-[var(--bg-component)] border border-[var(--border-color)] rounded-xl overflow-hidden transition-colors duration-300 hover:border-[#FACC15] hover:shadow-2xl hover:shadow-yellow-500/10"
      style={{ fontFamily: 'system-ui, -apple-system, Inter, sans-serif' }}
    >
      <div className="relative">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className={`w-full h-32 sm:h-48 object-cover ${isDisabled ? 'opacity-40' : ''}`}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <span className="bg-red-600 text-[var(--text-primary)] px-4 py-2 rounded-lg font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
            <span className="bg-[#FACC15] text-black px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold">
              Only {product.stock} left
            </span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-6">
        <div className="mb-2 sm:mb-3">
          <span className="text-[10px] sm:text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        <h3 className="text-sm sm:text-lg font-semibold text-[var(--text-primary)] mb-1 sm:mb-2 line-clamp-2">
          {product.name}
        </h3>

        {product.brand && (
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-2 sm:mb-3">
            {product.brand} {product.weight && `• ${product.weight}`}
          </p>
        )}

        {product.description && (
          <p className="hidden sm:block text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-2">
          <span className="text-lg sm:text-2xl font-bold text-[#FACC15]">
            ₹{product.price}
          </span>
          <span className="text-[10px] sm:text-xs text-[var(--text-muted)]">
            {product.stock} in stock
          </span>
        </div>

        <div className="mb-3 pb-3 sm:mb-4 sm:pb-4 border-b border-[#27272A]">
          {settings?.isFreeDelivery ? (
            <p className="text-[10px] sm:text-xs text-green-500 font-medium">Free Delivery</p>
          ) : (
            <p className="text-[10px] sm:text-xs text-[var(--text-secondary)]">+ ₹{settings?.deliveryCharge || 0} Delivery</p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-3">
          {user?.role === 'admin' ? (
            <div className="col-span-2 bg-[#27272A] rounded-lg p-3 text-center">
              <p className="text-[var(--text-secondary)] text-sm mb-1">Current Stock</p>
              <p className={`text-2xl font-bold ${product.stock <= 5 ? 'text-red-500' : 'text-[#FACC15]'}`}>
                {product.stock}
              </p>
            </div>
          ) : cartItem ? (
            <div className="flex items-center justify-between bg-[var(--bg-component)] rounded-lg p-2 sm:p-3 gap-2 border border-[var(--border-color)] sm:col-span-2">
              <button
                onClick={() => {
                  if (cartItem.quantity > 1) {
                    updateCartQuantity(product._id, cartItem.quantity - 1);
                  } else {
                    removeFromCart(product._id);
                  }
                }}
                className="p-1 sm:p-2 bg-[#27272A] text-[var(--text-primary)] rounded-lg hover:bg-[#3f3f46] transition-colors duration-200"
              >
                <FiMinus size={14} />
              </button>
              <span className="font-semibold text-[var(--text-primary)] text-sm sm:text-lg flex-1 text-center">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateCartQuantity(product._id, cartItem.quantity + 1)}
                disabled={cartItem.quantity >= product.maxQuantityPerOrder}
                className="p-1 sm:p-2 bg-[#27272A] text-[var(--text-primary)] rounded-lg hover:bg-[#3f3f46] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiPlus size={14} />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => addToCart(product)}
                disabled={isDisabled}
                className={`py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 ${isDisabled
                  ? 'bg-[#27272A] text-[var(--text-muted)] cursor-not-allowed sm:col-span-2'
                  : 'bg-[var(--bg-component)] text-[var(--text-primary)] border border-[#FACC15] hover:bg-[#27272A]'
                  }`}
              >
                <FiShoppingCart size={16} />
                {!isOrderingAllowed ? 'Closed' : 'Add'}
              </button>

              {!isDisabled && isOrderingAllowed && (
                <button
                  onClick={() => {
                    if (!cartItem) addToCart(product);
                    navigate('/checkout');
                  }}
                  className="py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 bg-[#FACC15] text-black hover:bg-[#f5c707] shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30"
                >
                  <FiZap size={16} />
                  Buy Now
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
