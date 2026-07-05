import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Inquiry from './pages/Inquiry';

// Components
import LoadingSpinner from './components/LoadingSpinner';

// Admin Pages (Lazy Loaded for split chunks)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminInquiries = lazy(() => import('./pages/admin/AdminInquiries'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              
              {/* Public Routes (wrapped in PublicLayout) */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/inquiry" element={<Inquiry />} />
              </Route>

              {/* Admin Login Route (No Layout wrapper) */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Routes (wrapped in AdminLayout, protected) */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="inquiries" element={<AdminInquiries />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Fallback Catch-All */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </Suspense>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
