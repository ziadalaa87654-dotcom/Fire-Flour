import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';

export default function Home() {
  const { showModal, showToast } = useApp();
  const { addToCart } = useCart();
  const introRef = useRef(null);

  const handleHeroScroll = () => {
    if (introRef.current) {
      introRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDishClick = (dish) => {
    const content = (
      <div className="dish-modal-content">
        <div className="dish-modal-header d-flex justify-content-between align-items-center">
          <span className="dish-modal-badge badge bg-danger">{dish.category.toUpperCase()}</span>
          <span className="dish-modal-price text-danger fw-bold fs-5">{dish.price}</span>
        </div>
        <p className="lead" style={{ fontSize: '16px', margin: '16px 0' }}>
          {dish.description}
        </p>
        <div className="modal-details text-muted small">
          <p className="mb-1">
            <strong>Ingredients & Preparation:</strong> {dish.details}
          </p>
          <p className="mb-0">
            <strong>Dietary Info:</strong> Vegetarian options & gluten-free crust available.
          </p>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button 
            className="btn btn-danger fw-bold px-4"
            onClick={() => {
              addToCart({ id: dish.id, name: dish.name, price: dish.price, category: dish.category, desc: dish.description }, 1);
              showToast(`Added "${dish.name}" to cart! 🛒`, 'success');
            }}
          >
            🛒 Add to Cart • {dish.price}
          </button>
          <Link to="/reservation" className="btn btn-outline-dark btn-sm" onClick={() => document.body.style.overflow = ''}>
            Book a Table ↗
          </Link>
        </div>
      </div>
    );

    showModal(dish.name, content);
  };

  const featuredDishes = [
    {
      id: 'p01',
      name: 'Fire Margherita',
      price: '€14',
      category: 'Pizza',
      description: 'San Marzano tomato · fior di latte · basil',
      details: 'Hand-stretched dough with San Marzano tomatoes, fresh fior di latte mozzarella, basil, and organic olive oil.',
      imageClass: 'pizza-image',
      isLarge: true,
    },
    {
      id: 'p05',
      name: 'Truffle Pasta',
      price: '€19',
      category: 'Pasta',
      description: 'Tagliatelle · parmesan · black truffle',
      details: 'Freshly made egg tagliatelle tossed in parmesan cream and garnished with shaved black truffle.',
      imageClass: 'pasta-image',
      isLarge: false,
    },
    {
      id: 'p07',
      name: 'Italian Garden',
      price: '€12',
      category: 'Salad',
      description: 'Rocket · burrata · tomatoes · pesto',
      details: 'Fresh wild rocket, creamy burrata cheese, heirloom tomatoes, house pesto, and aged balsamic glaze.',
      imageClass: 'salad-image',
      isLarge: false,
    },
  ];

  return (
    <main>
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <p className="eyebrow">PIZZA • PASTA • PASSIONE</p>
          <h1>
            Good food.<br />
            <em>Good mood.</em>
          </h1>
          <p className="hero-copy">
            Authentic Italian recipes, handmade dough and the finest ingredients — served with a little Palazzo attitude.
          </p>
          <div className="button-row">
            <Link className="btn btn-primary" to="/menu">
              Explore our menu <span>↗</span>
            </Link>
            <Link className="btn btn-light" to="/reservation">
              Book a table
            </Link>
          </div>
        </div>
        <div className="hero-scroll" onClick={handleHeroScroll}>
          SCROLL TO DISCOVER <span>↓</span>
        </div>
      </section>

      <section className="intro section" ref={introRef}>
        <div className="container intro-grid">
          <div>
            <p className="eyebrow dark">OUR PHILOSOPHY</p>
            <h2>
              Made with love,<br />
              <em>served with soul.</em>
            </h2>
          </div>
          <div>
            <p className="lead">
              At Fire & Flour, we believe the best moments start around a table. Our kitchen brings together the simplicity of Italian cooking and the energy of a modern pizzeria.
            </p>
            <Link className="text-link" to="/about">
              Discover our story <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="featured section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark">FROM THE KITCHEN</p>
              <h2>Our favourites</h2>
            </div>
            <Link className="text-link" to="/menu">
              View full menu <span>↗</span>
            </Link>
          </div>
          <div className="food-grid">
            {featuredDishes.map((dish) => (
              <article
                key={dish.id}
                className={`food-card ${dish.isLarge ? 'food-card-large' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleDishClick(dish)}
              >
                <div className={`food-image ${dish.imageClass}`}></div>
                <div className="food-info d-flex justify-content-between align-items-center">
                  <div>
                    <h3>{dish.name}</h3>
                    <p>{dish.description}</p>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <strong>{dish.price}</strong>
                    <button
                      className="btn btn-outline-danger btn-sm rounded-circle p-2"
                      title="Add to Cart"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ id: dish.id, name: dish.name, price: dish.price, category: dish.category, desc: dish.description }, 1);
                        showToast(`Added "${dish.name}" to cart! 🛒`, 'success');
                      }}
                    >
                      🛒
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dark-section statement">
        <div className="container centered">
          <p className="eyebrow">FRESH EVERY DAY</p>
          <h2>
            From our oven<br />
            <em>to your table.</em>
          </h2>
          <Link className="btn btn-outline" to="/reservation">
            Reserve your table
          </Link>
        </div>
      </section>

      <section className="reviews section">
        <div className="container review-grid">
          <div>
            <p className="eyebrow dark">WHAT PEOPLE SAY</p>
            <h2>
              La dolce<br />
              <em>vita.</em>
            </h2>
          </div>
          <blockquote>
            “The pizza is incredible, the atmosphere is beautiful, and every little detail feels considered. Fire and Flour is our new favourite.”
            <footer>— Sofia M. <span>★★★★★</span></footer>
          </blockquote>
        </div>
      </section>
    </main>
  );
}
