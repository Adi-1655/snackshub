import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPhone, FiLock, FiUser, FiHome, FiHash } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    name: '',
    hostelId: '',
    hostelName: '',
    roomNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login({ phone: formData.phone, password: formData.password });
        navigate('/');
      } else {
        await register(formData);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-5xl font-bold mb-2"
          >
            🍿
          </motion.h1>
          <h2 className="text-3xl font-bold text-white">SnackHub</h2>
          <p className="text-[#a1a1a6] mt-2">
            Your hostel snacks, delivered!
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#161616] border border-[#262626] rounded-2xl shadow-xl p-8"
        >
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${isLogin
                  ? 'bg-[#FACC15] text-black shadow-md'
                  : 'bg-[#0A0A0A] border border-[#262626] text-[#a1a1a6] hover:text-white'
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${!isLogin
                  ? 'bg-[#FACC15] text-black shadow-md'
                  : 'bg-[#0A0A0A] border border-[#262626] text-[#a1a1a6] hover:text-white'
                }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a1a1a6]" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:outline-none focus:border-[#FACC15] placeholder-gray-600"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a1a1a6]" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength="10"
                  pattern="[0-9]{10}"
                  className="w-full pl-10 pr-4 py-3 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:outline-none focus:border-[#FACC15] placeholder-gray-600"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                    Hostel ID
                  </label>
                  <div className="relative">
                    <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a1a1a6]" />
                    <input
                      type="text"
                      name="hostelId"
                      value={formData.hostelId}
                      onChange={handleChange}
                      required={!isLogin}
                      className="w-full pl-10 pr-4 py-3 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:outline-none focus:border-[#FACC15] placeholder-gray-600"
                      placeholder="e.g., HST001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                    Hostel Name
                  </label>
                  <div className="relative">
                    <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a1a1a6]" />
                    <input
                      type="text"
                      name="hostelName"
                      value={formData.hostelName}
                      onChange={handleChange}
                      required={!isLogin}
                      className="w-full pl-10 pr-4 py-3 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:outline-none focus:border-[#FACC15] placeholder-gray-600"
                      placeholder="e.g., Boys Hostel A"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                    Room Number
                  </label>
                  <div className="relative">
                    <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a1a1a6]" />
                    <input
                      type="text"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      required={!isLogin}
                      className="w-full pl-10 pr-4 py-3 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:outline-none focus:border-[#FACC15] placeholder-gray-600"
                      placeholder="e.g., 101"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-[#a1a1a6] mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a1a1a6]" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full pl-10 pr-4 py-3 border border-[#262626] rounded-lg bg-[#0A0A0A] text-white focus:outline-none focus:border-[#FACC15] placeholder-gray-600"
                  placeholder="Enter password (min 6 characters)"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FACC15] hover:bg-[#d4ac0d] text-black font-bold rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-black"></div>
                  Processing...
                </span>
              ) : isLogin ? (
                'Login'
              ) : (
                'Register'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-[#a1a1a6]">
            <p>
              Demo Login: <br />
              <span className="font-mono text-[#FACC15]">
                Phone: 9876543210 | Pass: password123
              </span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
