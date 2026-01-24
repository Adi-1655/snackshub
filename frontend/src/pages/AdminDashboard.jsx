import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiDollarSign,
  FiShoppingBag,
  FiPackage,
  FiAlertTriangle,
  FiUsers,
  FiClock,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiFileText,
  FiDownload,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { adminAPI, productAPI, settingsAPI, getImageUrl } from '../utils/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

const TimePicker = ({ label, value, onChange }) => {
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      let hNum = parseInt(h);
      const p = hNum >= 12 ? 'PM' : 'AM';
      hNum = hNum % 12 || 12;
      setHour(hNum.toString().padStart(2, '0'));
      setMinute(m);
      setPeriod(p);
    }
  }, [value]);

  const handleChange = (type, val) => {
    let newH = type === 'hour' ? val : hour;
    let newM = type === 'minute' ? val : minute;
    let newP = type === 'period' ? val : period;

    if (type === 'hour') setHour(val);
    else if (type === 'minute') setMinute(val);
    else if (type === 'period') setPeriod(val);

    let h = parseInt(newH);
    if (newP === 'PM' && h !== 12) h += 12;
    if (newP === 'AM' && h === 12) h = 0;
    const timeString = `${h.toString().padStart(2, '0')}:${newM}`;
    onChange(timeString);
  };

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  return (
    <div>
      <label className="block text-sm font-medium text-[#a1a1a6] mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        <select
          value={hour}
          onChange={(e) => handleChange('hour', e.target.value)}
          className="flex-1 min-w-[60px] px-4 py-2 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:border-[#FACC15]"
        >
          {hours.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        <span className="text-white self-center">:</span>
        <select
          value={minute}
          onChange={(e) => handleChange('minute', e.target.value)}
          className="flex-1 min-w-[60px] px-4 py-2 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:border-[#FACC15]"
        >
          {minutes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          value={period}
          onChange={(e) => handleChange('period', e.target.value)}
          className="flex-1 min-w-[60px] px-4 py-2 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:border-[#FACC15]"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { fetchSettings: refreshGlobalSettings } = useApp();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'dashboard');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [reportRange, setReportRange] = useState('daily');
  const [reportData, setReportData] = useState(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Chips',
    price: '',
    stock: '',
    maxQuantityPerOrder: 5,
    description: '',
    brand: '',
    weight: '',
    image: '/uploads/default-product.jpg',
  });

  useEffect(() => {
    fetchData();
  }, []); // Initial load only

  useEffect(() => {
    // Poll for updates if on dashboard/orders tab
    if (activeTab === 'dashboard' || activeTab === 'orders') {
      const interval = setInterval(fetchData, 15000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'reports') {
      fetchReportData(reportRange);
    }
  }, [reportRange, activeTab]);

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes, productsRes, settingsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllOrders(),
        productAPI.getAll(),
        settingsAPI.get(),
      ]);

      setStats(statsRes.data.data);
      setOrders(ordersRes.data.data);
      setProducts(productsRes.data.data);
      setSettings(settingsRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await adminAPI.updateOrderStatus(orderId, status);
      toast.success('Order status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      await settingsAPI.update(newSettings);
      toast.success('Settings updated');
      fetchData();
      refreshGlobalSettings();
      setActiveTab('dashboard');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: 'Chips',
        price: '',
        stock: '',
        maxQuantityPerOrder: 5,
        description: '',
        brand: '',
        weight: '',
        image: '/uploads/default-product.jpg',
      });
    }
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const saveProduct = async () => {
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct._id, formData);
        toast.success('Product updated successfully');
      } else {
        await adminAPI.createProduct(formData);
        toast.success('Product created successfully');
      }
      closeProductModal();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.deleteProduct(id);
        toast.success('Product deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const fetchReportData = async (range) => {
    try {
      const response = await adminAPI.getSalesReport(range);
      setReportData(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch report data');
    }
  };

  const downloadReport = (format = 'csv') => {
    if (!reportData) {
      toast.error('No report data available');
      return;
    }

    const timestamp = new Date().toLocaleString().replace(/[/:]/g, '-');

    if (format === 'csv') {
      const csvContent = generateCSVContent();
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
      element.setAttribute('download', `sales-report-${reportRange}-${timestamp}.csv`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Report downloaded successfully');
    }
  };

  const generateCSVContent = () => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Revenue', `₹${reportData.totalRevenue}`],
      ['Total Orders', reportData.totalOrders],
      ['Average Order Value', `₹${reportData.avgOrderValue}`],
      ['Total Customers', reportData.totalCustomers],
      [''],
      ['Top Products'],
      ['Product ID', 'Quantity Sold', 'Revenue Generated'],
    ];

    if (reportData.topProducts && reportData.topProducts.length > 0) {
      reportData.topProducts.forEach((product) => {
        rows.push([
          product._id,
          product.totalQuantity,
          `₹${product.totalRevenue}`,
        ]);
      });
    }

    const csvRows = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ];

    return csvRows.join('\n');
  };

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await adminAPI.uploadImage(file);
      if (response.data.success) {
        setFormData({ ...formData, image: response.data.imageUrl });
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto">
          {['dashboard', 'orders', 'products', 'reports', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${activeTab === tab
                ? 'bg-[#FACC15] text-black'
                : 'bg-[#161616] border border-[#262626] text-[#a1a1a6] hover:border-[#FACC15] hover:text-[#FACC15]'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                icon={<FiShoppingBag />}
                title="Total Orders"
                value={stats.totalOrders}
                subtitle={`${stats.todayOrders} today`}
                color="blue"
              />
              <StatsCard
                icon={<FiDollarSign />}
                title="Total Revenue"
                value={`₹${stats.totalRevenue}`}
                subtitle={`₹${stats.todayRevenue} today`}
                color="green"
              />
              <StatsCard
                icon={<FiPackage />}
                title="Pending Orders"
                value={stats.pendingOrders}
                color="yellow"
              />
              <StatsCard
                icon={<FiAlertTriangle />}
                title="Low Stock Items"
                value={stats.lowStockProducts}
                color="red"
              />
            </div>


          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {['All', 'Pending', 'Delivered', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors border border-[#262626] flex items-center gap-2 ${statusFilter === status
                    ? 'bg-[#FACC15] text-black border-[#FACC15]'
                    : 'bg-[#161616] text-[#a1a1a6] hover:bg-[#1F1F1F] hover:text-white'
                    }`}
                >
                  {status}
                  {status === 'Pending' && stats?.pendingOrders > 0 && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${statusFilter === 'Pending' ? 'bg-black text-[#FACC15]' : 'bg-[#FACC15] text-black'
                      }`}>
                      {stats.pendingOrders}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="bg-[#161616] border border-[#262626] rounded-xl shadow-md overflow-hidden hover:bg-[#1F1F1F] transition-all">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0A0A0A]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {orders
                      .filter((order) => {
                        if (statusFilter === 'All') return true;
                        if (statusFilter === 'Pending') return order.orderStatus === 'Confirmed' || order.orderStatus === 'Accepted';
                        return order.orderStatus === statusFilter;
                      })
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((order) => (
                        <tr key={order._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            #{order._id.slice(-8)}
                          </td>
                          <td className="px-6 py-4 text-sm text-white max-w-xs">
                            <div className="flex flex-col gap-1">
                              {order.orderItems.map((item, idx) => (
                                <span key={idx} className="text-[#a1a1a6]">
                                  {item.name} <span className="text-[#FACC15]">x{item.quantity}</span>
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {order.user?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#FACC15]">
                            ₹{order.totalAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400">
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              {order.orderStatus === 'Confirmed' && (
                                <>
                                  <button
                                    onClick={() => updateOrderStatus(order._id, 'Accepted')}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to cancel this order?')) {
                                        updateOrderStatus(order._id, 'Cancelled');
                                      }
                                    }}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {order.orderStatus === 'Accepted' && (
                                <>
                                  <button
                                    onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                  >
                                    Delivered
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to cancel this order?')) {
                                        updateOrderStatus(order._id, 'Cancelled');
                                      }
                                    }}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {(order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled') && (
                                <span className="text-gray-500 text-sm">-</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <button
              onClick={() => openProductModal()}
              className="flex items-center gap-2 mb-6 px-6 py-3 bg-[#FACC15] text-black rounded-lg font-semibold hover:bg-[#f5c707] transition-colors"
            >
              <FiPlus /> Add Product
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-[#161616] border border-[#262626] rounded-xl p-4 hover:bg-[#1F1F1F] transition-all"
                >
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-bold text-white">{product.name}</h3>
                  <p className="text-sm text-[#a1a1a6]">{product.category}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-[#FACC15]">₹{product.price}</span>
                    <span
                      className={`text-sm ${product.stock <= 5 ? 'text-red-400' : 'text-green-400'
                        }`}
                    >
                      Stock: {product.stock}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => openProductModal(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#FACC15] text-black rounded-lg hover:bg-[#f5c707] transition-colors font-medium"
                    >
                      <FiEdit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors font-medium"
                    >
                      <FiTrash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && settings && (
          <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 max-w-2xl hover:bg-[#1F1F1F] transition-all">
            <h2 className="text-xl font-bold text-white mb-6">
              System Settings
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TimePicker
                  label="Order Start Time"
                  value={settings.orderStartTime}
                  onChange={(val) => setSettings({ ...settings, orderStartTime: val })}
                />
                <TimePicker
                  label="Order End Time"
                  value={settings.orderEndTime}
                  onChange={(val) => setSettings({ ...settings, orderEndTime: val })}
                />

                <div>
                  <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                    Delivery Type
                  </label>
                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() => setSettings({ ...settings, isFreeDelivery: true })}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors border border-[#262626] ${settings.isFreeDelivery
                        ? 'bg-[#FACC15] text-black border-[#FACC15]'
                        : 'bg-[#0A0A0A] text-white hover:bg-[#1F1F1F]'
                        }`}
                    >
                      Free Delivery
                    </button>
                    <button
                      onClick={() => setSettings({ ...settings, isFreeDelivery: false })}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors border border-[#262626] ${!settings.isFreeDelivery
                        ? 'bg-[#FACC15] text-black border-[#FACC15]'
                        : 'bg-[#0A0A0A] text-white hover:bg-[#1F1F1F]'
                        }`}
                    >
                      Custom Charge
                    </button>
                  </div>

                  {!settings.isFreeDelivery && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                        Delivery Charge (₹)
                      </label>
                      <input
                        type="number"
                        value={settings.deliveryCharge}
                        onChange={(e) => setSettings({ ...settings, deliveryCharge: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:border-[#FACC15] mb-4"
                      />
                    </motion.div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                    Min Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.minOrderAmount}
                    onChange={(e) => setSettings({ ...settings, minOrderAmount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:border-[#FACC15]"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#262626]">
                <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-lg border border-[#262626]">
                  <div>
                    <h3 className="font-medium text-white">Enable Ordering</h3>
                    <p className="text-sm text-[#a1a1a6]">Allow customers to place orders</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.isOrderingEnabled}
                      onChange={(e) => setSettings({ ...settings, isOrderingEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FACC15]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-lg border border-[#262626]">
                  <div>
                    <h3 className="font-medium text-white">Maintenance Mode</h3>
                    <p className="text-sm text-[#a1a1a6]">Disable entire site access</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FACC15]"></div>
                  </label>
                </div>

                {settings.maintenanceMode && (
                  <div>
                    <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                      Maintenance Message
                    </label>
                    <textarea
                      value={settings.maintenanceMessage}
                      onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                      className="w-full px-4 py-2 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:border-[#FACC15]"
                      rows="2"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#262626]">
                <h3 className="font-medium text-white mb-4">Offer Carousel Images</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  {settings.offerImages && settings.offerImages.map((img, index) => (
                    <div key={index} className="relative group aspect-video bg-[#262626] rounded-lg overflow-hidden border border-[#262626]">
                      <img src={getImageUrl(img)} alt={`Offer ${index}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => {
                          const newImages = settings.offerImages.filter((_, i) => i !== index);
                          setSettings({ ...settings, offerImages: newImages });
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Image"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-[#262626] rounded-lg hover:border-[#FACC15] hover:text-[#FACC15] text-[#a1a1a6] cursor-pointer transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setUploading(true);
                        try {
                          const response = await adminAPI.uploadImage(file);
                          if (response.data.success) {
                            const newImages = [...(settings.offerImages || []), response.data.imageUrl];
                            setSettings({ ...settings, offerImages: newImages });
                            toast.success('Image uploaded');
                          }
                        } catch (error) {
                          toast.error('Failed to upload image');
                        } finally {
                          setUploading(false);
                        }
                      }}
                    />
                    {uploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-[#FACC15]"></div>
                    ) : (
                      <>
                        <FiPlus size={24} className="mb-2" />
                        <span className="text-sm">Add Image</span>
                      </>
                    )}
                  </label>
                </div>
                <p className="text-xs text-[#a1a1a6]">
                  Upload images to display in the auto-scrolling carousel on the home page.
                </p>
              </div>

              <button
                onClick={() => updateSettings(settings)}
                className="w-full py-3 bg-[#FACC15] text-black rounded-lg font-semibold hover:bg-[#f5c707] transition-colors mt-6"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex gap-4 mb-6 flex-wrap">
              <div className="flex gap-4">
                {['daily', 'weekly', 'monthly', 'yearly'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setReportRange(range)}
                    className={`px-6 py-2 rounded-lg font-medium capitalize transition-all ${reportRange === range
                      ? 'bg-[#FACC15] text-black'
                      : 'bg-[#161616] border border-[#262626] text-[#a1a1a6] hover:border-[#FACC15] hover:text-[#FACC15]'
                      }`}
                  >
                    {range}
                  </button>
                ))}
              </div>

              {reportData && (
                <div className="flex gap-3 ml-auto">
                  <button
                    onClick={() => downloadReport('csv')}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <FiDownload size={18} /> Download CSV
                  </button>
                </div>
              )}
            </div>

            {reportData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Trend Graph */}
                <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 hover:bg-[#1F1F1F] transition-all">
                  <h3 className="text-lg font-bold text-white mb-4">Revenue Trend</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={reportData.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="name" stroke="#a1a1a6" tick={{ fill: '#a1a1a6' }} axisLine={{ stroke: '#333' }} tickLine={false} />
                        <YAxis stroke="#a1a1a6" tick={{ fill: '#a1a1a6' }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #262626', color: '#fff', borderRadius: '8px' }}
                          itemStyle={{ color: '#FACC15' }}
                          formatter={(value) => [`₹${value}`, 'Revenue']}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          name="Revenue"
                          stroke="#FACC15"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#0A0A0A', stroke: '#FACC15', strokeWidth: 2 }}
                          activeDot={{ r: 6, fill: '#FACC15' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Daily Orders Graph */}
                <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 hover:bg-[#1F1F1F] transition-all">
                  <h3 className="text-lg font-bold text-white mb-4">Daily Orders</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="name" stroke="#a1a1a6" tick={{ fill: '#a1a1a6' }} axisLine={{ stroke: '#333' }} tickLine={false} />
                        <YAxis stroke="#a1a1a6" tick={{ fill: '#a1a1a6' }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #262626', color: '#fff', borderRadius: '8px' }}
                          itemStyle={{ color: '#FACC15' }}
                          cursor={{ fill: '#262626', opacity: 0.5 }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar
                          dataKey="orders"
                          name="Orders"
                          fill="#FACC15"
                          radius={[4, 4, 0, 0]}
                          barSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {reportData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 hover:bg-[#1F1F1F] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
                      <FiDollarSign size={32} />
                    </div>
                    <div>
                      <p className="text-sm text-[#71717A]">Total Revenue</p>
                      <p className="text-2xl font-bold text-white">
                        ₹{reportData.totalRevenue || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 hover:bg-[#1F1F1F] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                      <FiShoppingBag size={32} />
                    </div>
                    <div>
                      <p className="text-sm text-[#71717A]">Total Orders</p>
                      <p className="text-2xl font-bold text-white">
                        {reportData.totalOrders || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 hover:bg-[#1F1F1F] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-[#FACC15]/20 text-[#FACC15]">
                      <FiFileText size={32} />
                    </div>
                    <div>
                      <p className="text-sm text-[#71717A]">Avg Order Value</p>
                      <p className="text-2xl font-bold text-white">
                        ₹{reportData.avgOrderValue || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 hover:bg-[#1F1F1F] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                      <FiUsers size={32} />
                    </div>
                    <div>
                      <p className="text-sm text-[#71717A]">Total Customers</p>
                      <p className="text-2xl font-bold text-white">
                        {reportData.totalCustomers || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {reportData && reportData.topProducts && reportData.topProducts.length > 0 && (
              <div className="bg-[#161616] border border-[#262626] rounded-xl p-6 hover:bg-[#1F1F1F] transition-all">
                <h3 className="text-lg font-bold text-white mb-4">
                  Top Selling Products
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0A0A0A]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                          Product ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                          Qty Sold
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {reportData.topProducts.map((product, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {product._id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {product.totalQuantity}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-green-600">
                            ₹{product.totalRevenue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#161616] border border-[#262626] rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={closeProductModal}
                  className="p-2 hover:bg-[#1F1F1F] rounded-lg text-[#a1a1a6]"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:border-[#FACC15]"
                    placeholder="Product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#a1a1a6] mb-2 flex justify-between">
                    Category
                    <button
                      onClick={() => {
                        setIsNewCategory(!isNewCategory);
                        setFormData({ ...formData, category: '' });
                      }}
                      className="text-[#FACC15] text-xs hover:underline"
                    >
                      {isNewCategory ? 'Select Existing' : 'Add New'}
                    </button>
                  </label>
                  {isNewCategory ? (
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:border-[#FACC15]"
                      placeholder="Enter new category"
                    />
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:border-[#FACC15]"
                    >
                      <option value="">Select Category</option>
                      <option>Chips</option>
                      <option>Biscuits</option>
                      <option>Chocolates</option>
                      <option>Cold Drinks</option>
                      <option>Instant Noodles</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:border-[#FACC15]"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:border-[#FACC15]"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:border-[#FACC15]"
                    placeholder="Brand name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                    Max Quantity Per Order
                  </label>
                  <input
                    type="number"
                    value={formData.maxQuantityPerOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, maxQuantityPerOrder: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:border-[#FACC15]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                    Product Image
                  </label>
                  <div className="flex items-start gap-4">
                    {formData.image && (
                      <img
                        src={getImageUrl(formData.image)}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-[#262626]"
                      />
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full text-sm text-[#a1a1a6] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#FACC15] file:text-black hover:file:bg-[#f5c707]"
                      />
                      {uploading && (
                        <p className="text-xs text-[#FACC15] mt-1">Uploading...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:border-[#FACC15]"
                  rows="3"
                  placeholder="Product description"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={closeProductModal}
                  className="flex-1 px-6 py-2 border border-[#262626] rounded-lg font-medium text-[#a1a1a6] hover:border-[#FACC15] hover:text-[#FACC15] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProduct}
                  className="flex-1 px-6 py-2 bg-[#FACC15] text-black rounded-lg font-medium hover:bg-[#f5c707] transition-colors"
                >
                  Save Product
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatsCard = ({ icon, title, value, subtitle, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-[#FACC15]/20 text-[#FACC15]',
    red: 'bg-red-500/20 text-red-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#161616] border border-[#262626] rounded-xl p-6 hover:bg-[#1F1F1F] transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
      <h3 className="text-sm font-medium text-[#71717A] mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subtitle && (
        <p className="text-sm text-[#a1a1a6] mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
