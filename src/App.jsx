import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Modal from './components/Modal';
import Toast from './components/Toast';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Reservation from './pages/Reservation';

import AdminLayout from './components/Admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Users from './pages/admin/Users';
import Reservations from './pages/admin/Reservations';

function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTopOnNavigate />
        
        <Routes>
          {}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="users" element={<Users />} />
            <Route path="reservations" element={<Reservations />} />
          </Route>

          {}
          <Route
            path="*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/reservation" element={<Reservation />} />
                </Routes>
                <Footer />
                <BackToTop />
              </>
            }
          />
        </Routes>

        {}
        <CartDrawer />
        <AuthModal />
        <Modal />
        <Toast />
      </CartProvider>
    </AuthProvider>
  );
}
