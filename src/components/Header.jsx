import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const { cartCount, toggleCart } = useCart();

  const isSolidPage = location.pathname !== '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsNavOpen(false);
    setIsUserDropdownOpen(false);
  }, [location]);

  return (
    <>
      <header className={`site-header ${isSolidPage ? 'solid' : ''} ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-wrap d-flex justify-content-between align-items-center">
          
          {}
          <Link className="logo text-decoration-none" to="/">
            FIRE & FLOUR<span>•</span>
          </Link>

          {}
          <nav className={`nav ${isNavOpen ? 'open' : ''}`}>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
              Home
            </NavLink>
            <NavLink to="/menu" className={({ isActive }) => (isActive ? 'active' : '')}>
              Menu
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
              About
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active text-danger fw-bold' : 'text-danger')}>
                👑 Admin
              </NavLink>
            )}
            <NavLink to="/reservation" className={({ isActive }) => `nav-cta ${isActive ? 'active-cta' : ''}`}>
              Book a table
            </NavLink>
          </nav>

          {}
          <div className="header-actions d-flex align-items-center gap-2 gap-sm-3">
            
            {}
            <button 
              className="btn btn-outline-danger btn-sm position-relative d-flex align-items-center gap-2 rounded-pill px-3 py-1"
              style={{ borderColor: 'var(--red)', color: isSolidPage ? 'var(--ink)' : '#fff' }}
              onClick={toggleCart}
              title="Open Shopping Cart"
            >
              <span>🛒</span>
              <span className="fw-semibold">Cart</span>
              {cartCount > 0 && (
                <span className="badge bg-danger rounded-pill px-2">{cartCount}</span>
              )}
            </button>

            {}
            {isAuthenticated ? (
              <div className="position-relative">
                <button
                  className="btn btn-sm btn-dark rounded-pill px-3 py-1 d-flex align-items-center gap-2"
                  onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                >
                  <span>👤</span>
                  <span className="fw-semibold small d-none d-sm-inline">{user.name || user.email.split('@')[0]}</span>
                  {isAdmin && <span className="badge bg-warning text-dark px-1" style={{ fontSize: '10px' }}>ADMIN</span>}
                </button>

                {}
                {isUserDropdownOpen && (
                  <div 
                    className="position-absolute end-0 mt-2 bg-white shadow-lg rounded-3 py-2 px-3 border text-start"
                    style={{ minWidth: '220px', zIndex: 1060, color: '#171714' }}
                  >
                    <div className="border-bottom pb-2 mb-2">
                      <div className="fw-bold small">{user.name}</div>
                      <div className="text-muted small" style={{ fontSize: '11px' }}>{user.email}</div>
                      <span className={`badge mt-1 ${isAdmin ? 'bg-danger' : 'bg-secondary'}`} style={{ fontSize: '10px' }}>
                        Role: {user.role.toUpperCase()}
                      </span>
                    </div>

                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="d-block text-danger fw-semibold small py-1 text-decoration-none"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        ⚡ Admin Portal
                      </Link>
                    )}

                    <button
                      className="btn btn-link text-muted p-0 small text-decoration-none mt-1 d-block w-100 text-start"
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="btn btn-sm btn-dark rounded-pill px-3 py-1 fw-semibold"
                onClick={() => openAuthModal('login')}
              >
                Sign In
              </button>
            )}

            {}
            <button
              className="nav-toggle d-lg-none ms-1"
              aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isNavOpen}
              onClick={() => setIsNavOpen((prev) => !prev)}
            >
              {isNavOpen ? '✕' : '☰'}
            </button>

          </div>

        </div>
      </header>

      <div
        className={`nav-backdrop ${isNavOpen ? 'open' : ''}`}
        onClick={() => setIsNavOpen(false)}
      />
    </>
  );
}
