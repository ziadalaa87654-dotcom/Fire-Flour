import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link className="logo light-logo" to="/">
            FIRE & FLOUR<span>•</span>
          </Link>
          <p>
            Italian food. Modern spirit.<br />
            Made fresh, made happy.
          </p>
        </div>
        <div>
          <p className="footer-label">VISIT</p>
          <p>
            126 St Maadi<br />
            Cairo, Egypt
          </p>
        </div>
        <div>
          <p className="footer-label">OPEN</p>
          <p>
            Mon–Thu 11:00–23:00<br />
            Fri–Sun 11:00–00:00
          </p>
        </div>
        <div>
          <p className="footer-label">FOLLOW</p>
          <p>
            <a href="#instagram">Instagram</a><br />
            <a href="#facebook">Facebook</a>
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Fire & Flour Pizzeria</span>
        <span>Made for good times.</span>
      </div>
    </footer>
  );
}
