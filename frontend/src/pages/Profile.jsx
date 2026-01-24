import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiHome, FiMapPin, FiSave, FiEdit2, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, login } = useAuth(); // We can use login logic to update local user state if needed, or just refresh
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        hostelName: user?.hostelName || '',
        roomNumber: user?.roomNumber || '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        setLoading(true);
        try {
            const updateData = {
                name: formData.name,
                hostelName: formData.hostelName,
                roomNumber: formData.roomNumber,
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            const { data } = await authAPI.updateProfile(updateData);

            if (data.success) {
                // Update local storage and context
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data));
                // Force reload or better way to update context?
                // Ideally context exposes an update function, but re-login works too
                // or we just assume user is updated if we reload page
                toast.success('Profile updated successfully');
                setIsEditing(false);
                window.location.reload();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-base)]">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--bg-component)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xl"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#FACC15] to-[#EAB308] p-6 text-black">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <FiUser className="text-3xl" />
                                My Profile
                            </h1>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-black/10 hover:bg-black/20 rounded-lg backdrop-blur-sm transition-all font-semibold flex items-center gap-2"
                                >
                                    <FiEdit2 /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Personal Info */}
                                <div className="md:col-span-2">
                                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 border-b border-[var(--border-color)] pb-2">
                                        Personal Information
                                    </h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <FiUser className="absolute left-3 top-3 text-[var(--text-muted)]" />
                                        <input
                                            type="text"
                                            name="name"
                                            disabled={!isEditing}
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isEditing
                                                ? 'bg-[var(--bg-base)] border-[var(--border-color)] focus:border-[#FACC15] text-[var(--text-primary)]'
                                                : 'bg-[var(--bg-hover)] border-transparent text-[var(--text-secondary)] cursor-not-allowed'
                                                }`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <FiPhone className="absolute left-3 top-3 text-[var(--text-muted)]" />
                                        <input
                                            type="text"
                                            disabled
                                            value={formData.phone}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--bg-hover)] border border-transparent text-[var(--text-muted)] cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                <div className="md:col-span-2 mt-2">
                                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 border-b border-[var(--border-color)] pb-2">
                                        Delivery Details
                                    </h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Hostel Name
                                    </label>
                                    <div className="relative">
                                        <FiHome className="absolute left-3 top-3 text-[var(--text-muted)]" />
                                        <input
                                            type="text"
                                            name="hostelName"
                                            disabled={!isEditing}
                                            value={formData.hostelName}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isEditing
                                                ? 'bg-[var(--bg-base)] border-[var(--border-color)] focus:border-[#FACC15] text-[var(--text-primary)]'
                                                : 'bg-[var(--bg-hover)] border-transparent text-[var(--text-secondary)] cursor-not-allowed'
                                                }`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Room Number
                                    </label>
                                    <div className="relative">
                                        <FiMapPin className="absolute left-3 top-3 text-[var(--text-muted)]" />
                                        <input
                                            type="text"
                                            name="roomNumber"
                                            disabled={!isEditing}
                                            value={formData.roomNumber}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isEditing
                                                ? 'bg-[var(--bg-base)] border-[var(--border-color)] focus:border-[#FACC15] text-[var(--text-primary)]'
                                                : 'bg-[var(--bg-hover)] border-transparent text-[var(--text-secondary)] cursor-not-allowed'
                                                }`}
                                        />
                                    </div>
                                </div>

                                {/* Security (Only in Edit Mode) */}
                                {isEditing && (
                                    <>
                                        <div className="md:col-span-2 mt-2">
                                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 border-b border-[var(--border-color)] pb-2">
                                                Security (Optional)
                                            </h3>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <FiLock className="absolute left-3 top-3 text-[var(--text-muted)]" />
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="Leave blank to keep current"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)] focus:border-[#FACC15] text-[var(--text-primary)]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <FiLock className="absolute left-3 top-3 text-[var(--text-muted)]" />
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    placeholder="Confirm new password"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)] focus:border-[#FACC15] text-[var(--text-primary)]"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                            </div>

                            {/* Actions */}
                            {isEditing && (
                                <div className="flex gap-4 mt-8 pt-6 border-t border-[var(--border-color)]">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                name: user?.name || '',
                                                phone: user?.phone || '',
                                                hostelName: user?.hostelName || '',
                                                roomNumber: user?.roomNumber || '',
                                                password: '',
                                                confirmPassword: ''
                                            });
                                        }}
                                        className="flex-1 px-6 py-3 rounded-xl border border-[var(--border-color)] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-6 py-3 rounded-xl bg-[#FACC15] text-black font-semibold hover:bg-[#EAB308] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <FiSave /> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
