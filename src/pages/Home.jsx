import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Home() {
  const { showModal } = useApp();
  const introRef = useRef(null);

  const handleHeroScroll = () => {
    if (introRef.current) {
      introRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDishClick = (dish) => {
    const content = (
      <div className="dish-modal-content">
        <div className="dish-modal-header">
          <span className="dish-modal-badge">{dish.category.toUpperCase()}</span>
          <span className="dish-modal-price">{dish.price}</span>
        </div>
        <p className="lead" style={{ fontSize: '16px', margin: '16px 0' }}>
          {dish.description}
        </p>
        <div className="modal-details">
          <p>
            <strong>Ingredients & Preparation:</strong> {dish.details}
          </p>
          <p>
            <strong>Dietary Info:</strong> Vegetarian options & gluten-free crust available upon request.
          </p>
        </div>
        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <Link to="/reservation" className="btn btn-primary" onClick={() => document.body.style.overflow = ''}>
            Reserve a table to try this ↗
          </Link>
        </div>
      </div>
    );

    showModal(dish.name, content);
  };

  const featuredDishes = [
    {
      id: 'margherita',
      name: 'Fire Margherita',
      price: '€14',
      category: 'Pizza',
      description: 'San Marzano tomato · fior di latte · basil',
      details: 'Hand-stretched dough with San Marzano tomatoes, fresh fior di latte mozzarella, basil, and organic olive oil.',
      imageClass: 'pizza-image',
      isLarge: true,
    },
    {
      id: 'truffle-pasta',
      name: 'Truffle Pasta',
      price: '€19',
      category: 'Pasta',
      description: 'Tagliatelle · parmesan · black truffle',
      details: 'Freshly made egg tagliatelle tossed in parmesan cream and garnished with shaved black truffle.',
      imageClass: 'pasta-image',
      isLarge: false,
    },
    {
      id: 'italian-garden',
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
                <div className="food-info">
                  <div>
                    <h3>{dish.name}</h3>
                    <p>{dish.description}</p>
                  </div>
                  <strong>{dish.price}</strong>
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
