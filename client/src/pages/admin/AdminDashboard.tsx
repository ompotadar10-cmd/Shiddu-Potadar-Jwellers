import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiFolder, FiMail, FiBell, FiPlus, FiArrowRight, FiUser, FiSettings } from 'react-icons/fi';
import { getStats } from '../../services/api';
import { DashboardStats } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const statCards = [
    {
      label: 'Total Designs',
      value: stats?.totalProducts ?? 0,
      icon: FiPackage,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      label: 'Categories',
      value: stats?.totalCategories ?? 0,
      icon: FiFolder,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      label: 'Total Inquiries',
      value: stats?.totalInquiries ?? 0,
      icon: FiMail,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      label: 'New Notifications',
      value: stats?.newInquiries ?? 0,
      icon: FiBell,
      color: stats?.newInquiries && stats.newInquiries > 0
        ? 'text-rose-600 bg-rose-50 border-rose-200 animate-pulse'
        : 'text-gray-600 bg-gray-50 border-gray-200',
    },
  ];

  return (
    <div className="space-y-8 font-body">
      
      {/* Welcome Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-dark">
            Welcome, Administrator
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Overview of store inventory, inquiries and category settings.
          </p>
        </div>

        {/* Quick Create Action */}
        <button
          onClick={() => navigate('/admin/products?action=add')}
          className="gold-gradient hover:from-gold-600 hover:to-gold-700 text-dark font-bold text-xs uppercase tracking-wider py-3 px-5 rounded flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10 transition-all duration-300"
        >
          <FiPlus /> Add New Design
        </button>
      </div>

      {/* ─── STATISTICS ROW ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-lg p-6 border border-gray-200/60 shadow-sm flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-dark">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── TWO COLUMNS DETAIL BLOCK ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1 & 2: Recent Uploads (Left/Mid) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200/60 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-dark">
                Recent Design Additions
              </h2>
              <Link to="/admin/products" className="text-xs font-semibold text-gold-600 hover:text-gold-700 flex items-center gap-1">
                Manage Products <FiArrowRight />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Design Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Weight & Purity</th>
                    <th className="px-6 py-4">Show Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  {stats?.recentProducts && stats.recentProducts.length > 0 ? (
                    stats.recentProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-dark">{prod.name}</td>
                        <td className="px-6 py-4">{prod.category}</td>
                        <td className="px-6 py-4">
                          {prod.weight || 'N/A'} • {prod.purity || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          {prod.show_price && prod.price ? `₹${prod.price.toLocaleString('en-IN')}` : 'Hidden'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                        No product designs seeded. Click Add New Design to start.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Column 3: Quick System Actions (Right) */}
        <div className="bg-white rounded-lg border border-gray-200/60 shadow-sm p-6 space-y-6">
          <h2 className="font-display text-lg font-bold text-dark pb-3 border-b border-gray-100">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 gap-3">
            <Link
              to="/admin/inquiries"
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-gold-500/20 hover:bg-white hover:shadow transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <FiMail />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-dark group-hover:text-gold-600 transition-colors">
                    Review Inquiries
                  </h3>
                  <p className="text-[10px] text-gray-400">Check customer message queries</p>
                </div>
              </div>
              <FiArrowRight className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/admin/categories"
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-gold-500/20 hover:bg-white hover:shadow transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <FiFolder />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-dark group-hover:text-gold-600 transition-colors">
                    Manage Categories
                  </h3>
                  <p className="text-[10px] text-gray-400">Add or alter ornament categories</p>
                </div>
              </div>
              <FiArrowRight className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/admin/settings"
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-gold-500/20 hover:bg-white hover:shadow transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600">
                  <FiSettings />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-dark group-hover:text-gold-600 transition-colors">
                    Store Settings
                  </h3>
                  <p className="text-[10px] text-gray-400">Edit address, phone, and hero title</p>
                </div>
              </div>
              <FiArrowRight className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-gold-50/30 rounded-lg border border-gold-200/20 p-4 space-y-3.5 text-xs text-gray-600">
            <div className="flex justify-between items-center">
              <span>Admin Username</span>
              <span className="font-semibold text-dark flex items-center gap-1"><FiUser /> admin</span>
            </div>
            <div className="flex justify-between items-center border-t border-gold-200/10 pt-2.5">
              <span>Database File</span>
              <span className="font-mono text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded">shop.db</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
