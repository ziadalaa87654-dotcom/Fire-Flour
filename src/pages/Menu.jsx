import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const menuItemsData = [
  { id: '01', category: 'pizza', name: 'Margherita', desc: 'San Marzano tomato, fior di latte, basil, olive oil', price: '€14' },
  { id: '02', category: 'pizza', name: 'Diavola', desc: 'Tomato, mozzarella, spicy salami, chilli, basil', price: '€17' },
  { id: '03', category: 'pizza', name: 'Prosciutto e Burrata', desc: 'Tomato, mozzarella, prosciutto, creamy burrata, rocket', price: '€19' },
  { id: '04', category: 'pizza', name: 'Funghi', desc: 'Mozzarella, wild mushrooms, thyme, parmesan', price: '€16' },
  { id: '05', category: 'pasta', name: 'Truffle Tagliatelle', desc: 'Fresh pasta, parmesan cream, black truffle', price: '€19' },
  { id: '06', category: 'pasta', name: 'Arrabbiata', desc: 'Rigatoni, tomato, garlic, chilli, parsley', price: '€15' },
  { id: '07', category: 'salad', name: 'Italian Garden', desc: 'Rocket, cherry tomato, burrata, pesto, balsamic', price: '€12' },
  { id: '08', category: 'salad', name: 'Caprese', desc: 'Heirloom tomatoes, mozzarella, basil, olive oil', price: '€13' },
  { id: '09', category: 'dessert', name: 'Tiramisu', desc: 'Mascarpone, espresso, cocoa, ladyfingers', price: '€9' },
  { id: '10', category: 'dessert', name: 'Panna Cotta', desc: 'Vanilla cream, seasonal berries, citrus', price: '€8' },
];

const categories = [
  { key: 'all', label: 'All' },
  { key: 'pizza', label: 'Pizza' },
  { key: 'pasta', label: 'Pasta' },
  { key: 'salad', label: 'Salads' },
  { key: 'dessert', label: 'Dessert' },
];

export default function Menu() {
  const { showModal } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryCounts = useMemo(() => {
    const counts = { all: menuItemsData.length };
    menuItemsData.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredItems = useMemo(() => {
    return menuItemsData.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const text = `${item.name} ${item.desc} ${item.price}`.toLowerCase();
      const matchesSearch = !searchQuery || text.includes(searchQuery.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleDishClick = (item) => {
    const content = (
      <div className="dish-modal-content">
        <div className="dish-modal-header">
          <span className="dish-modal-badge">{item.category.toUpperCase()}</span>
          <span className="dish-modal-price">{item.price}</span>
        </div>
        <p className="lead" style={{ fontSize: '16px', margin: '16px 0' }}>
          {item.desc}
        </p>
        <div className="modal-details">
          <p>
            <strong>Ingredients & Preparation:</strong> Made to order with Italian specialty ingredients, slow fermentation dough, and authentic recipes.
          </p>
          <p>
            <strong>Dietary Info:</strong> Vegetarian and custom choices available upon request.
          </p>
        </div>
        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <Link to="/reservation" className="btn btn-primary" onClick={() => document.body.style.overflow = ''}>
            Reserve a table to try this ↗
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

          <div className="menu-list">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="menu-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDishClick(item)}
                >
                  <div>
                    <span className="menu-number">{item.id}</span>
                    <h3>{item.name}</h3>
                    <p>{item.desc}</p>
                  </div>
                  <strong>{item.price}</strong>
                </article>
              ))
            ) : (
              <div className="no-menu-results">
                <p>No dishes found matching your selection.</p>
              </div>
            )}
          </div>
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
