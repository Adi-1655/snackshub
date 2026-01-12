import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiAlertCircle } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

const Home = () => {
  const { products, fetchProducts, settings, isOrderingAllowed, checkOrderingTime } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Chips', 'Biscuits', 'Chocolates', 'Cold Drinks', 'Instant Noodles'];

  useEffect(() => {
    loadProducts();
    checkOrderingTime();
    const interval = setInterval(checkOrderingTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    await fetchProducts({ available: true });
    setLoading(false);
  };

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ordering Status Banner */}
        {!isOrderingAllowed && settings && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-[#161616] border border-[#FACC15]/30 rounded-lg p-4 flex items-start gap-3"
          >
            <FiAlertCircle className="text-[#FACC15] text-xl mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-[#FACC15]">
                Ordering Currently Closed
              </h3>
              <p className="text-sm text-[#a1a1a6] mt-1">
                Orders are accepted between {settings.orderStartTime} and{' '}
                {settings.orderEndTime}. You can browse items, but ordering is disabled.
              </p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-2"
          >
            Explore Snacks 🍿
          </motion.h1>
          <p className="text-[#a1a1a6]">
            Order your favorite snacks from the comfort of your room!
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FiFilter className="text-[#a1a1a6]" />
            <h2 className="text-lg font-semibold text-white">Categories</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                  ? 'bg-[#FACC15] text-black shadow-lg shadow-yellow-500/20'
                    : 'bg-[#161616] text-[#a1a1a6] border border-[#262626] hover:border-[#FACC15] hover:text-[#FACC15]'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              No products found
            </h3>
            <p className="text-[#a1a1a6]">
              Try selecting a different category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
