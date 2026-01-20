import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiMoon, FiSun, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount, darkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = getCartItemsCount();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className="sticky top-0 z-50 bg-[#161616] border-b border-[#262626]"
      style={{ fontFamily: 'system-ui, -apple-system, Inter, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-white flex items-center gap-2"
            >
              <span className="text-2xl">🍿</span>
              <span className="text-white">
                SnackHub
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {user && (
              <>
                <span className="text-[#a1a1a6]">
                  Hi, <span className="text-white font-semibold">{user.name}</span>
                </span>

                <Link
                  to="/orders"
                  className="text-[#a1a1a6] hover:text-[#FACC15] transition-colors duration-200 font-medium"
                >
                  {user.role === 'admin' ? 'Pending Orders' : 'My Orders'}
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 bg-[#262626] text-white rounded-lg hover:bg-[#FACC15] hover:text-black transition-all duration-200 font-semibold"
                  >
                    Admin Panel
                  </Link>
                )}

                <Link to="/cart" className="relative">
                  <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
                    <FiShoppingCart className="text-2xl text-[#a1a1a6] hover:text-[#FACC15] transition-colors duration-200" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-3 bg-[#FACC15] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </motion.div>
                </Link>

                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-[#262626] border border-[#262626] hover:border-[#FACC15] transition-all duration-200"
                >
                  {darkMode ? (
                    <FiSun className="text-xl text-[#FACC15]" />
                  ) : (
                    <FiMoon className="text-xl text-[#a1a1a6]" />
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FACC15] text-black rounded-lg hover:bg-[#f5c707] transition-all duration-200 font-semibold"
                >
                  <FiLogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#111111] text-white"
          >
            {isMenuOpen ? (
              <FiX className="text-2xl" />
            ) : (
              <FiMenu className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#161616] border-t border-[#262626]"
          >
            <div className="px-6 py-6 space-y-4">
              {user && (
                <>
                  <div className="flex items-center gap-3 pb-4 border-b border-[#262626]">
                    <div className="w-10 h-10 bg-[#262626] rounded-lg flex items-center justify-center">
                      <FiUser className="text-[#FACC15]" />
                    </div>
                    <span className="text-white font-semibold">
                      {user.name}
                    </span>
                  </div>

                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-3 text-[#a1a1a6] hover:text-[#FACC15] transition-colors duration-200 font-medium"
                  >
                    {user.role === 'admin' ? 'Pending Orders' : 'My Orders'}
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-[#a1a1a6] hover:text-[#FACC15] transition-colors duration-200 font-medium"
                  >
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span className="bg-[#FACC15] text-black text-xs font-bold rounded-full px-2 py-1">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-3 text-[#FACC15] font-semibold"
                    >
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center gap-2 py-3 text-[#a1a1a6] hover:text-[#FACC15] transition-colors duration-200 font-medium"
                  >
                    {darkMode ? <FiSun /> : <FiMoon />}
                    <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full py-3 px-4 mt-4 bg-[#FACC15] text-black rounded-lg hover:bg-[#f5c707] transition-all duration-200 font-semibold"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
