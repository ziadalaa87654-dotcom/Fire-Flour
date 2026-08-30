import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import productService from '../services/productService';

const categories = [
  { key: 'all', label: 'All' },
  { key: 'pizza', label: 'Pizza' },
  { key: 'pasta', label: 'Pasta' },
  { key: 'salad', label: 'Salads' },
  { key: 'dessert', label: 'Dessert' },
];

export default function Menu() {
  const { showModal, showToast } = useApp();
  const { addToCart } = useCart();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await productService.getProducts();
        setItems(data);
      } catch (err) {
        showToast('Failed to load menu items', 'danger');
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, [showToast]);

  const categoryCounts = useMemo(() => {
    const counts = { all: items.length };
    items.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const text = `${item.name} ${item.desc} ${item.price}`.toLowerCase();
      const matchesSearch = !searchQuery || text.includes(searchQuery.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    addToCart(item, 1);
    showToast(`Added "${item.name}" to cart! 🛒`, 'success', 2500);
  };

  const handleDishClick = (item) => {
    const content = (
      <div className="dish-modal-content">
        {item.image && (
          <img 
            src={item.image} 
            alt={item.name} 
            style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }}
          />
        )}
        <div className="dish-modal-header d-flex justify-content-between align-items-center">
          <span className="dish-modal-badge badge bg-danger">{String(item.category).toUpperCase()}</span>
          <span className="dish-modal-price text-danger fw-bold fs-5">€{Number(item.price).toFixed(2)}</span>
        </div>
        <p className="lead" style={{ fontSize: '16px', margin: '16px 0' }}>
          {item.desc}
        </p>
        <div className="modal-details text-muted small">
          <p className="mb-1">
            <strong>Ingredients & Preparation:</strong> Made fresh to order with authentic Italian ingredients and artisanal wood-fired techniques.
          </p>
          <p className="mb-0">
            <strong>Dietary Info:</strong> Vegetarian and custom requests available.
          </p>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button 
            className="btn btn-danger fw-bold px-4"
            onClick={() => {
              addToCart(item, 1);
              showToast(`Added "${item.name}" to cart! 🛒`, 'success');
            }}
          >
            🛒 Add to Cart • €{Number(item.price).toFixed(2)}
          </button>
          <Link to="/reservation" className="btn btn-outline-dark btn-sm" onClick={() => document.body.style.overflow = ''}>
            Book a Table ↗
          </Link>
        </div>
      </div>
    );

    showModal(item.name, content);
  };

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow dark">MANGIA BENE</p>
          <h1>
            Our <em>menu.</em>
          </h1>
          <p>Simple ingredients. Big flavour. Everything made fresh in our kitchen.</p>
        </div>
      </section>

      <section className="menu-section section">
        <div className="container">
          <div className="filters-bar">
            <div className="filters">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  className={`filter ${activeCategory === cat.key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  {cat.label}
                  <span className="filter-badge">{categoryCounts[cat.key] || 0}</span>
                </button>
              ))}
            </div>

            <div className="menu-search-wrap">
              <input
                type="text"
                className="menu-search-input"
                placeholder="Search menu..."
                aria-label="Search menu items"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="menu-search-clear visible"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status" />
            </div>
          ) : (
            <div className="menu-list">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <article
                    key={item.id}
                    className="menu-item d-flex justify-content-between align-items-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDishClick(item)}
                  >
                    <div className="d-flex align-items-center gap-3">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      )}
                      <div>
                        <span className="menu-number">{(index + 1).toString().padStart(2, '0')}</span>
                        <h3 className="mb-1">{item.name}</h3>
                        <p className="mb-0">{item.desc}</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3 ms-3">
                      <strong className="text-danger fs-5">€{Number(item.price).toFixed(2)}</strong>
                      <button 
                        type="button"
                        className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 fw-bold"
                        onClick={(e) => handleAddToCart(e, item)}
                        title="Add to Cart"
                      >
                        + Add 🛒
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="no-menu-results">
                  <p>No dishes found matching your selection.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="dark-section cta-strip">
        <div className="container split-cta">
          <h2>Hungry yet?</h2>
          <Link className="btn btn-outline" to="/reservation">
            Book a table ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
