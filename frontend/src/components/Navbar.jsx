import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiMoon, FiSun, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { adminAPI } from '../utils/api';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount, darkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const cartCount = getCartItemsCount();

  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchStats = async () => {
        try {
          const { data } = await adminAPI.getStats();
          setPendingCount(data.data.pendingOrders);
        } catch (error) {
          console.error('Failed to fetch admin stats:', error);
        }
      };

      fetchStats();
      const interval = setInterval(fetchStats, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className="sticky top-0 z-50 bg-[var(--bg-component)] border-b border-[var(--border-color)]"
      style={{ fontFamily: 'system-ui, -apple-system, Inter, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2"
            >
              <span className="text-2xl">🍿</span>
              <span className="text-[var(--text-primary)]">
                SnackHub
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {user && (
              <>
                <Link to="/profile" className="text-[var(--text-secondary)] hover:text-[#FACC15] transition-colors flex items-center gap-2">
                  <span className="text-[var(--text-primary)] font-semibold">{user.name}</span>
                  <div className="w-8 h-8 bg-[#262626] rounded-full flex items-center justify-center border border-[var(--border-color)]">
                    <FiUser className="text-[#FACC15] text-sm" />
                  </div>
                </Link>

                <Link
                  to="/orders"
                  className="text-[var(--text-secondary)] hover:text-[#FACC15] transition-colors duration-200 font-medium relative"
                >
                  {user.role === 'admin' ? 'Pending Orders' : 'My Orders'}
                  {user.role === 'admin' && pendingCount > 0 && (
                    <span className="absolute -top-3 -right-3 bg-[#FACC15] text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 bg-[#262626] text-[var(--text-primary)] rounded-lg hover:bg-[#FACC15] hover:text-black transition-all duration-200 font-semibold"
                  >
                    Admin Panel
                  </Link>
                )}

                <Link to="/cart" className="relative">
                  <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
                    <FiShoppingCart className="text-2xl text-[var(--text-secondary)] hover:text-[#FACC15] transition-colors duration-200" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-3 bg-[#FACC15] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </motion.div>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-[var(--bg-component)] border border-[var(--border-color)] hover:border-[#FACC15] transition-colors"
                >
                  {darkMode ? (
                    <FiSun className="text-xl text-[#FACC15]" />
                  ) : (
                    <FiMoon className="text-xl text-[var(--text-secondary)]" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FACC15] text-black rounded-lg hover:bg-[#f5c707] transition-colors font-semibold shadow-md"
                >
                  <FiLogOut size={18} />
                  Logout
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
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
            className="md:hidden bg-[var(--bg-component)] border-t border-[var(--border-color)]"
          >
            <div className="px-6 py-6 space-y-4">
              {user && (
                <>
                  <Link to="/profile" className="flex items-center gap-3 pb-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] -mx-6 px-6 transition-colors">
                    <div className="w-10 h-10 bg-[#262626] rounded-lg flex items-center justify-center">
                      <FiUser className="text-[#FACC15]" />
                    </div>
                    <span className="text-[var(--text-primary)] font-semibold">
                      {user.name}
                    </span>
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-[var(--text-secondary)] hover:text-[#FACC15] transition-colors duration-200 font-medium"
                  >
                    <span>{user.role === 'admin' ? 'Pending Orders' : 'My Orders'}</span>
                    {user.role === 'admin' && pendingCount > 0 && (
                      <span className="bg-[#FACC15] text-black text-xs font-bold rounded-full px-2 py-0.5">
                        {pendingCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-[var(--text-secondary)] hover:text-[#FACC15] transition-colors duration-200 font-medium"
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
                    className="flex items-center gap-2 py-3 text-[var(--text-secondary)] hover:text-[#FACC15] transition-colors duration-200 font-medium"
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
