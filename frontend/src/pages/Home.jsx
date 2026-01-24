import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiAlertCircle } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

import OfferCarousel from '../components/OfferCarousel';

const Home = () => {
  const { products, fetchProducts, settings, isOrderingAllowed, orderingMessage, checkOrderingTime } = useApp();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
    fetchCategories();
    checkOrderingTime();
    const interval = setInterval(checkOrderingTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      if (response.data.success) {
        setCategories(['All', ...response.data.data]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    await fetchProducts({ available: true });
    setLoading(false);
  };

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  // Sort by stock for admins
  if (user?.role === 'admin') {
    filteredProducts.sort((a, b) => a.stock - b.stock);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ordering Status Banner */}
        {!isOrderingAllowed && settings && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-[var(--bg-component)] border border-[#FACC15]/30 rounded-lg p-4 flex items-start gap-3"
          >
            <FiAlertCircle className="text-[#FACC15] text-xl mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-[#FACC15]">
                Ordering Currently Closed
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {orderingMessage || 'Ordering is currently disabled by the administrator.'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Offer Carousel */}
        {settings?.offerImages && settings.offerImages.length > 0 && (
          <OfferCarousel images={settings.offerImages} />
        )}

        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2"
          >
            Explore Snacks 🍿
          </motion.h1>
          <p className="text-[var(--text-secondary)]">
            Order your favorite snacks from the comfort of your room!
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FiFilter className="text-[var(--text-secondary)]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Categories</h2>
          </div>

          {/* Category Scroller */}
          <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-medium text-sm sm:text-base whitespace-nowrap transition-all border ${selectedCategory === category
                  ? 'bg-[#FACC15] text-black border-[#FACC15] shadow-lg shadow-yellow-500/20'
                  : 'bg-[var(--bg-component)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[#FACC15] hover:text-[#FACC15]'
                  }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {
          loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
                No products found
              </h3>
              <p className="text-[var(--text-secondary)]">
                Try selecting a different category
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 24,
                        duration: 0.5
                      }
                    }
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )
        }
      </div >
    </div >
  );
};

export default Home;
