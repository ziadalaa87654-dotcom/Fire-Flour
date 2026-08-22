import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

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
  }, [location]);

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  return (
    <>
      <header className={`site-header ${isSolidPage ? 'solid' : ''} ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-wrap">
          <Link className="logo" to="/">
            FIRE & FLOUR<span>•</span>
          </Link>
          <button
            className="nav-toggle"
            aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isNavOpen}
            onClick={toggleNav}
          >
            {isNavOpen ? '✕' : '☰'}
          </button>
          <nav className={`nav ${isNavOpen ? 'open' : ''}`}>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active' : '')}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/menu"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Menu
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              About
            </NavLink>
            <NavLink
              to="/reservation"
              className={({ isActive }) => `nav-cta ${isActive ? 'active-cta' : ''}`}
            >
              Book a table
            </NavLink>
          </nav>
        </div>
      </header>
      <div
        className={`nav-backdrop ${isNavOpen ? 'open' : ''}`}
        onClick={() => setIsNavOpen(false)}
      />
    </>
  );
}
