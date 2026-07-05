import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { FiLock, FiUser, FiArrowRight } from 'react-icons/fi';

const AdminLogin: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      showError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      showSuccess('Logged in successfully!');
      navigate('/admin/dashboard');
    } catch (err: any) {
      showError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-body select-none">
      
      {/* Brand Label */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-widest text-gold-500">
          SIDDU POTADAR
        </h1>
        <p className="text-[10px] tracking-[0.25em] text-gold-200/60 uppercase">
          Administrative Portal
        </p>
      </div>

      {/* Login Box */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-dark-light border border-gold-900/10 py-8 px-6 sm:px-10 rounded-lg shadow-2xl space-y-6">
          <div>
            <h2 className="text-center font-display text-xl font-bold text-white mb-1">
              Sign In
            </h2>
            <p className="text-center text-[11px] text-gray-400">
              Enter credentials to access inventory manager
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter admin username"
                  className="w-full bg-dark text-white border border-gold-900/20 rounded py-2.5 pl-10 pr-3 text-xs focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder-gray-600"
                />
                <FiUser className="absolute left-3.5 top-3 text-gold-500/50 w-4 h-4" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-dark text-white border border-gold-900/20 rounded py-2.5 pl-10 pr-3 text-xs focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all placeholder-gray-600"
                />
                <FiLock className="absolute left-3.5 top-3 text-gold-500/50 w-4 h-4" />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient hover:from-gold-600 hover:to-gold-700 text-dark font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded transition-all duration-300 shadow-lg shadow-gold-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : (
                <>
                  Access Dashboard <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Home Back option */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-[10px] font-semibold tracking-wider text-gray-500 hover:text-gold-500 uppercase transition-all"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>

    </div>
  );
};

export default AdminLogin;
