import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  FiGrid, 
  FiPackage, 
  FiFolder, 
  FiMail, 
  FiSettings, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiUser 
} from 'react-icons/fi';

const AdminLayout: React.FC = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { showSuccess } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not logged in (and not loading)
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    showSuccess('Logged out successfully');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
    { name: 'Products', path: '/admin/products', icon: FiPackage },
    { name: 'Categories', path: '/admin/categories', icon: FiFolder },
    { name: 'Inquiries', path: '/admin/inquiries', icon: FiMail },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-body">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-dark text-white flex-shrink-0 border-r border-gold-900/30">
        {/* Brand */}
        <div className="flex items-center justify-center h-20 px-6 border-b border-gold-900/20">
          <Link to="/" className="text-xl font-display font-bold tracking-wider text-gold-500 hover:text-gold-400 transition-colors">
            Siddu Potadar
          </Link>
        </div>

        {/* User profile brief */}
        <div className="flex items-center px-6 py-4 border-b border-gold-900/10">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold-600/20 border border-gold-500/30 text-gold-500 mr-3">
            <FiUser className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-200">{user?.username || 'Admin'}</div>
            <div className="text-xs text-gold-500 capitalize">{user?.role || 'Administrator'}</div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gold-500 text-dark font-semibold shadow-lg shadow-gold-500/20'
                    : 'text-gray-400 hover:bg-dark-light hover:text-white'
                }`}
              >
                <Icon className={`mr-3 w-5 h-5 ${isActive ? 'text-dark' : 'text-gold-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gold-900/10">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
          >
            <FiLogOut className="mr-3 w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark text-white flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-gold-900/20">
          <span className="text-xl font-display font-bold tracking-wider text-gold-500">
            Siddu Potadar
          </span>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center px-6 py-4 border-b border-gold-900/10">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold-600/20 text-gold-500 mr-3">
            <FiUser className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-200">{user?.username || 'Admin'}</div>
            <div className="text-xs text-gold-500 capitalize">{user?.role || 'Administrator'}</div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto" onClick={() => setSidebarOpen(false)}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gold-500 text-dark font-semibold'
                    : 'text-gray-400 hover:bg-dark-light hover:text-white'
                }`}
              >
                <Icon className={`mr-3 w-5 h-5 ${isActive ? 'text-dark' : 'text-gold-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gold-900/10">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <FiLogOut className="mr-3 w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Top Header */}
        <header className="flex items-center justify-between h-20 px-6 bg-white border-b border-gray-200 md:hidden flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-dark focus:outline-none"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <span className="text-lg font-display font-bold text-dark">
            Admin Panel
          </span>
          <div className="w-6 h-6"></div> {/* Spacer */}
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
