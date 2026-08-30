import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: 'Project Goal & Executive Overview',
    subtitle: 'Fire & Flour • Artisanal Neapolitan Pizzeria Platform',
    content: (
      <div>
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="p-4 rounded-3 bg-light border h-100">
              <h5 className="fw-bold text-danger mb-3">🎯 Primary Objectives</h5>
              <ul className="mb-0 text-muted lh-lg">
                <li>Deliver a premium, responsive e-commerce web platform for Fire & Flour pizzeria.</li>
                <li>Provide full end-to-end user journeys: menu discovery, dish customization, reservation, and online ordering.</li>
                <li>Enforce site-wide Authentication and Role-Based Authorization for customers and staff.</li>
                <li>Provide administrative management tools to manage products and users without touching database scripts.</li>
              </ul>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-4 rounded-3 bg-dark text-white h-100">
              <h5 className="fw-bold text-warning mb-3">💡 Key System Features</h5>
              <div className="d-flex flex-column gap-2 small">
                <div className="p-2 bg-secondary bg-opacity-25 rounded">✔ <strong>React / Next.js Architecture</strong> with Bootstrap 5 design</div>
                <div className="p-2 bg-secondary bg-opacity-25 rounded">✔ <strong>Auth & Authz Layer</strong> (JWT Session + Admin Guards)</div>
                <div className="p-2 bg-secondary bg-opacity-25 rounded">✔ <strong>Plug-and-Play Backend API</strong> with seamless local fallback</div>
                <div className="p-2 bg-secondary bg-opacity-25 rounded">✔ <strong>Mandatory Shopping Cart</strong> with live counters & checkout</div>
                <div className="p-2 bg-secondary bg-opacity-25 rounded">✔ <strong>Full Admin Portal</strong> for Products & Users CRUD</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: 'System Architecture & Tech Stack',
    subtitle: 'Simplest, standard React & API flow design',
    content: (
      <div>
        <div className="row g-4 align-items-center mb-4">
          <div className="col-md-4">
            <div className="card border-danger border-2 p-3 text-center h-100">
              <span className="display-5 mb-2">⚛️</span>
              <h5 className="fw-bold">Frontend Presentation Layer</h5>
              <p className="small text-muted mb-0">React 18 + Bootstrap 5 + Context API (AuthContext, CartContext, AppContext)</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-dark border-2 p-3 text-center h-100">
              <span className="display-5 mb-2">🔌</span>
              <h5 className="fw-bold">API Integration Layer</h5>
              <p className="small text-muted mb-0">Unified `apiClient` with dynamic endpoint resolution (`VITE_API_URL`) & auto fallback</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-warning border-2 p-3 text-center h-100">
              <span className="display-5 mb-2">⚙️</span>
              <h5 className="fw-bold">Backend Database Service</h5>
              <p className="small text-muted mb-0">Express / Node REST API backend providing JSON payloads for products, auth, and users</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-light rounded border">
          <h6 className="fw-bold mb-2">🔄 Data & Request Flow</h6>
          <code className="d-block p-2 bg-dark text-warning rounded small">
            User Action (Add to Cart / Login) ➔ Context Provider State Update ➔ API Service Call (apiClient) ➔ Express Backend Endpoint ➔ Response JSON ➔ UI Re-render
          </code>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: 'Authentication & Authorization Matrix',
    subtitle: 'Securing the whole website with role-based access control',
    content: (
      <div>
        <div className="table-responsive mb-4">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Page / Action</th>
                <th>Guest (Unauthenticated)</th>
                <th>Customer (User Role)</th>
                <th>Administrator (Admin Role)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-bold text-start">View Home / Menu / About</td>
                <td className="text-success fw-bold">✓ Allowed</td>
                <td className="text-success fw-bold">✓ Allowed</td>
                <td className="text-success fw-bold">✓ Allowed</td>
              </tr>
              <tr>
                <td className="fw-bold text-start">Add Dishes to Shopping Cart</td>
                <td className="text-success fw-bold">✓ Allowed</td>
                <td className="text-success fw-bold">✓ Allowed</td>
                <td className="text-success fw-bold">✓ Allowed</td>
              </tr>
              <tr>
                <td className="fw-bold text-start">Book Table Reservation</td>
                <td className="text-success fw-bold">✓ Allowed</td>
                <td className="text-success fw-bold">✓ Allowed</td>
                <td className="text-success fw-bold">✓ Allowed</td>
              </tr>
              <tr>
                <td className="fw-bold text-start">Access Admin Portal (`/admin/*`)</td>
                <td className="text-danger fw-bold">✕ Blocked (Redirect)</td>
                <td className="text-danger fw-bold">✕ Access Denied</td>
                <td className="text-success fw-bold">✓ Granted</td>
              </tr>
              <tr>
                <td className="fw-bold text-start">Manage Products & Users (CRUD)</td>
                <td className="text-danger fw-bold">✕ Blocked</td>
                <td className="text-danger fw-bold">✕ Blocked</td>
                <td className="text-success fw-bold">✓ Full Control</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="alert alert-info border-0 mb-0">
          <strong>🔒 Security Implementation:</strong> `ProtectedRoute` component intercepts all `/admin` routes, verifying `user.role === 'admin'` before mounting child pages.
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: 'Shopping Cart & Checkout Flow',
    subtitle: 'Mandatory seamless ordering experience',
    content: (
      <div>
        <div className="row g-4 align-items-center mb-4">
          <div className="col-md-3">
            <div className="p-3 bg-light rounded text-center border">
              <div className="fs-3 mb-1">1️⃣</div>
              <h6 className="fw-bold">Browse Dishes</h6>
              <p className="small text-muted mb-0">Customer selects dish from Menu or Home page</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-light rounded text-center border">
              <div className="fs-3 mb-1">2️⃣</div>
              <h6 className="fw-bold">Add to Cart</h6>
              <p className="small text-muted mb-0">Dishes added to `CartContext` with real-time badge count</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-light rounded text-center border">
              <div className="fs-3 mb-1">3️⃣</div>
              <h6 className="fw-bold">Adjust Quantity</h6>
              <p className="small text-muted mb-0">Cart Drawer allows modifying quantities or removing items</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-light rounded text-center border">
              <div className="fs-3 mb-1">4️⃣</div>
              <h6 className="fw-bold">Checkout Order</h6>
              <p className="small text-muted mb-0">Instant price calculation and order submission</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-danger bg-opacity-10 rounded-3 border border-danger">
          <h6 className="fw-bold text-danger mb-2">🛒 Cart Features at a Glance:</h6>
          <ul className="mb-0 text-dark small lh-lg">
            <li><strong>Persistent Local Storage:</strong> Cart contents remain saved even if page is refreshed.</li>
            <li><strong>Live Counter Badge:</strong> Header navigation badge updates immediately on item insertion.</li>
            <li><strong>Slide-over Cart Drawer:</strong> Quick view without navigating away from current page.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: 'Admin Management Portal (CRUD)',
    subtitle: 'Complete administrative control for Products & Users',
    content: (
      <div>
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="p-4 bg-white rounded shadow-sm border h-100">
              <h5 className="fw-bold text-danger mb-3">🍕 Product Management</h5>
              <ul className="small text-muted lh-lg mb-0">
                <li><strong>CREATE:</strong> Add new menu items with image, price, category, and ingredients.</li>
                <li><strong>READ:</strong> Filter products by category (Pizza, Pasta, Salad, Dessert) or search bar.</li>
                <li><strong>UPDATE:</strong> Modify prices, descriptions, or dish categories via `ProductModal`.</li>
                <li><strong>DELETE:</strong> Instant deletion with safety confirmation prompts.</li>
              </ul>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-4 bg-white rounded shadow-sm border h-100">
              <h5 className="fw-bold text-dark mb-3">👥 User Management</h5>
              <ul className="small text-muted lh-lg mb-0">
                <li><strong>READ:</strong> View all registered users, emails, and assigned roles.</li>
                <li><strong>UPDATE:</strong> Promote standard users to `Administrator` role or demote staff.</li>
                <li><strong>DELETE:</strong> Remove user accounts safely (preventing self-deletion).</li>
                <li><strong>CREATE:</strong> Manually register user accounts directly from admin panel.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: 'Backend API Integration Specs',
    subtitle: 'Plug-and-play REST API contract for your backend code',
    content: (
      <div>
        <div className="p-3 bg-dark text-white rounded mb-4">
          <h6 className="text-warning fw-bold mb-2">Backend REST API Endpoints Contract</h6>
          <div className="table-responsive">
            <table className="table table-dark table-sm small mb-0">
              <thead>
                <tr className="text-warning">
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Description</th>
                  <th>Auth Required</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="badge bg-success">POST</span></td>
                  <td>`/api/auth/login`</td>
                  <td>Authenticates credentials & returns JWT token + user object</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td><span className="badge bg-success">POST</span></td>
                  <td>`/api/auth/register`</td>
                  <td>Registers new account (name, email, password, role)</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td><span className="badge bg-primary">GET</span></td>
                  <td>`/api/products`</td>
                  <td>Returns list of all products JSON array</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td><span className="badge bg-success">POST</span></td>
                  <td>`/api/products`</td>
                  <td>Creates new product item</td>
                  <td>Yes (Admin)</td>
                </tr>
                <tr>
                  <td><span className="badge bg-warning text-dark">PUT</span></td>
                  <td>`/api/products/:id`</td>
                  <td>Updates existing product item details</td>
                  <td>Yes (Admin)</td>
                </tr>
                <tr>
                  <td><span className="badge bg-danger">DELETE</span></td>
                  <td>`/api/products/:id`</td>
                  <td>Deletes product item</td>
                  <td>Yes (Admin)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="alert alert-success border-0 mb-0">
          <strong>💡 Instant Connectivity:</strong> Set `VITE_API_URL=http://localhost:5000/api` in your `.env` file when your backend server is running!
        </div>
      </div>
    ),
  },
];

export default function Presentation() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentSlide = slides[currentSlideIndex];

  return (
    <main className="py-5" style={{ minHeight: '85vh', background: '#faf8f3' }}>
      <div className="container">
        
        {}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <span className="badge bg-danger text-uppercase px-3 py-2">Project Presentation Deck</span>
            <h1 className="display-6 fw-bold font-serif mt-2 mb-0" style={{ color: '#171714' }}>
              Fire & Flour Architecture
            </h1>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-dark btn-sm px-3"
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentSlideIndex === 0}
            >
              ← Previous
            </button>
            <span className="align-self-center small fw-bold px-2">
              Slide {currentSlideIndex + 1} / {slides.length}
            </span>
            <button
              className="btn btn-danger btn-sm px-3 fw-bold"
              onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlideIndex === slides.length - 1}
            >
              Next Slide →
            </button>
          </div>
        </div>

        {}
        <div className="nav nav-pills gap-2 mb-4 p-2 bg-white rounded shadow-sm border overflow-auto flex-nowrap">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              className={`nav-link text-nowrap small py-2 px-3 ${currentSlideIndex === idx ? 'active bg-danger fw-bold' : 'text-dark opacity-75'}`}
              onClick={() => setCurrentSlideIndex(idx)}
            >
              {s.id}. {s.title.split(' ')[0]} {s.title.split(' ')[1]}
            </button>
          ))}
        </div>

        {}
        <div 
          className="card border-0 shadow-lg p-4 p-md-5"
          style={{ background: '#fff', borderRadius: '16px', minHeight: '440px' }}
        >
          <div className="border-bottom pb-3 mb-4">
            <h2 className="fw-bold font-serif text-dark mb-1">{currentSlide.title}</h2>
            <p className="text-muted mb-0">{currentSlide.subtitle}</p>
          </div>

          <div>{currentSlide.content}</div>
        </div>

        {}
        <div className="d-flex justify-content-between align-items-center mt-4 text-muted small">
          <div>Built with React, Next.js conventions & Bootstrap 5</div>
          <div className="d-flex gap-3">
            <Link to="/menu" className="text-danger fw-bold text-decoration-none">Try Customer Menu ↗</Link>
            <Link to="/admin" className="text-danger fw-bold text-decoration-none">Open Admin Portal ↗</Link>
          </div>
        </div>

      </div>
    </main>
  );
}
