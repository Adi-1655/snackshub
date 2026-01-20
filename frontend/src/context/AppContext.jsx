import { createContext, useState, useContext, useEffect } from 'react';
import { productAPI, settingsAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [isOrderingAllowed, setIsOrderingAllowed] = useState(false);
  const [orderingMessage, setOrderingMessage] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    fetchProducts();
    fetchSettings();
    checkOrderingTime();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchProducts = async (filters = {}) => {
    try {
      const { data } = await productAPI.getAll(filters);
      setProducts(data.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await settingsAPI.get();
      setSettings(data.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const checkOrderingTime = async () => {
    try {
      const { data } = await settingsAPI.checkOrdering();
      setIsOrderingAllowed(data.data.isAllowed);
      setOrderingMessage(data.data.message || '');
    } catch (error) {
      console.error('Failed to check ordering time:', error);
    }
  };

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.maxQuantityPerOrder) {
        toast.error(`Maximum ${product.maxQuantityPerOrder} units allowed`);
        return;
      }
      if (newQuantity > product.stock) {
        toast.error('Insufficient stock');
        return;
      }
      setCart(
        cart.map((item) =>
          item._id === product._id ? { ...item, quantity: newQuantity } : item
        )
      );
    } else {
      if (quantity > product.maxQuantityPerOrder) {
        toast.error(`Maximum ${product.maxQuantityPerOrder} units allowed`);
        return;
      }
      if (quantity > product.stock) {
        toast.error('Insufficient stock');
        return;
      }
      setCart([...cart, { ...product, quantity }]);
    }
    toast.success('Added to cart!');
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId));
    toast.success('Removed from cart');
  };

  const updateCartQuantity = (productId, quantity) => {
    const product = cart.find((item) => item._id === productId);
    if (!product) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (quantity > product.maxQuantityPerOrder) {
      toast.error(`Maximum ${product.maxQuantityPerOrder} units allowed`);
      return;
    }

    if (quantity > product.stock) {
      toast.error('Insufficient stock');
      return;
    }

    setCart(
      cart.map((item) => (item._id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const value = {
    cart,
    products,
    settings,
    isOrderingAllowed,
    orderingMessage,
    darkMode,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    fetchProducts,
    fetchSettings,
    checkOrderingTime,
    toggleDarkMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
