import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function AnimatedCounter({ targetValue, suffix }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            const duration = 1500;
            const startTime = performance.now();

            const update = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeProgress = progress * (2 - progress);
              const currentVal = Math.floor(easeProgress * targetValue);

              setCount(currentVal);

              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                setCount(targetValue);
              }
            };

            requestAnimationFrame(update);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [targetValue]);

  return (
    <strong ref={elementRef}>
      {count}
      {suffix}
    </strong>
  );
}

export default function About() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow dark">FIRE & FLOUR STORY</p>
          <h1>
            Born from a love<br />
            of <em>Italian food.</em>
          </h1>
        </div>
      </section>

      <section className="story section">
        <div className="container story-grid">
          <div className="story-image"></div>
          <div>
            <p className="eyebrow dark">OUR STORY</p>
            <h2>
              A little bit of Italy,<br />
              right around the corner.
            </h2>
            <p className="lead">
              Fire & Flour started with a simple idea: create a place where people could slow down, share a pizza and enjoy the moment.
            </p>
            <p>
              We work with seasonal produce, Italian cheeses, quality flour and the kind of patience that good food demands. Our dough ferments slowly, our sauces are made in-house and every pizza is finished in a hot stone oven.
            </p>
            <p>
              But Fire & Flour is about more than food. It is about friends staying for one more drink, families sharing dessert and strangers becoming regulars.
            </p>
            <Link className="btn btn-dark" to="/menu">
              Taste the story ↗
            </Link>
          </div>
        </div>
      </section>

      <section className="numbers dark-section">
        <div className="container number-grid">
          <div>
            <AnimatedCounter targetValue={48} suffix="h" />
            <span>slow-fermented dough</span>
          </div>
          <div>
            <AnimatedCounter targetValue={100} suffix="%" />
            <span>Italian-inspired recipes</span>
          </div>
          <div>
            <AnimatedCounter targetValue={1} suffix="" />
            <span>very happy kitchen</span>
          </div>
        </div>
      </section>

      <section className="section centered">
        <div className="container narrow">
          <p className="eyebrow dark">COME AS YOU ARE</p>
          <h2>
            Pull up a chair.<br />
            <em>Stay awhile.</em>
          </h2>
          <Link className="btn btn-dark" to="/reservation">
            Reserve a table
          </Link>
        </div>
      </section>
    </main>
  );
}
