import { motion } from 'framer-motion';
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const ProductCard = ({ product }) => {
  const { addToCart, cart, isOrderingAllowed, updateCartQuantity, removeFromCart } = useApp();
  const cartItem = cart.find((item) => item._id === product._id);

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isDisabled = !product.isAvailable || isOutOfStock || !isOrderingAllowed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="bg-[#161616] border border-[#262626] rounded-xl overflow-hidden transition-all duration-300 hover:bg-[#1F1F1F] hover:border-[#FACC15] hover:shadow-2xl hover:shadow-yellow-500/10"
      style={{ fontFamily: 'system-ui, -apple-system, Inter, sans-serif' }}
    >
      <div className="relative">
        <img
          src={product.image || '/placeholder-product.jpg'}
          alt={product.name}
          className={`w-full h-48 object-cover ${isDisabled ? 'opacity-40' : ''}`}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-4 right-4">
            <span className="bg-[#FACC15] text-black px-3 py-1 rounded-lg text-xs font-semibold">
              Only {product.stock} left
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-3">
          <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {product.name}
        </h3>

        {product.brand && (
          <p className="text-sm text-[#71717A] mb-3">
            {product.brand} {product.weight && `• ${product.weight}`}
          </p>
        )}

        {product.description && (
          <p className="text-sm text-[#a1a1a6] mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#27272A]">
          <span className="text-2xl font-bold text-[#FACC15]">
            ₹{product.price}
          </span>
          <span className="text-xs text-[#71717A]">
            {product.stock} in stock
          </span>
        </div>

        {cartItem ? (
          <div className="flex items-center justify-between bg-[#161616] rounded-lg p-3 gap-2">
            <button
              onClick={() => {
                if (cartItem.quantity > 1) {
                  updateCartQuantity(product._id, cartItem.quantity - 1);
                } else {
                  removeFromCart(product._id);
                }
              }}
              className="p-2 bg-[#27272A] text-white rounded-lg hover:bg-[#3f3f46] transition-colors duration-200"
            >
              <FiMinus size={16} />
            </button>
            <span className="font-semibold text-white text-lg flex-1 text-center">
              {cartItem.quantity}
            </span>
            <button
              onClick={() => updateCartQuantity(product._id, cartItem.quantity + 1)}
              disabled={cartItem.quantity >= product.maxQuantityPerOrder}
              className="p-2 bg-[#27272A] text-white rounded-lg hover:bg-[#3f3f46] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlus size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(product)}
            disabled={isDisabled}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              isDisabled
                ? 'bg-[#27272A] text-[#71717A] cursor-not-allowed'
                : 'bg-[#FACC15] text-black hover:bg-[#f5c707] shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30'
            }`}
          >
            <FiShoppingCart size={18} />
            {!isOrderingAllowed ? 'Ordering Closed' : 'Add to Cart'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
