import React from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f4f0e7' }}>
      
      {}
      <aside 
        className="bg-dark text-white p-4 d-flex flex-column justify-content-between"
        style={{ width: '260px', flexShrink: 0 }}
      >
        <div>
          <div className="border-bottom border-secondary pb-3 mb-4">
            <Link to="/" className="text-white text-decoration-none h5 fw-bold letter-spacing-1">
              FIRE & FLOUR <span className="text-danger">•</span>
            </Link>
            <div className="small text-danger font-monospace mt-1">ADMIN CONTROL PANEL</div>
          </div>

          <nav className="nav flex-column gap-2">
            <NavLink 
              to="/admin" 
              end
              className={({ isActive }) => 
                `nav-link px-3 py-2 rounded text-white ${isActive ? 'bg-danger fw-bold' : 'opacity-75 hover-opacity-100'}`
              }
            >
              Overview Dashboard
            </NavLink>

            <NavLink 
              to="/admin/products" 
              className={({ isActive }) => 
                `nav-link px-3 py-2 rounded text-white ${isActive ? 'bg-danger fw-bold' : 'opacity-75 hover-opacity-100'}`
              }
            >
              Product Management
            </NavLink>

            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => 
                `nav-link px-3 py-2 rounded text-white ${isActive ? 'bg-danger fw-bold' : 'opacity-75 hover-opacity-100'}`
              }
            >
              User Management
            </NavLink>

            <NavLink 
              to="/admin/reservations" 
              className={({ isActive }) => 
                `nav-link px-3 py-2 rounded text-white ${isActive ? 'bg-danger fw-bold' : 'opacity-75 hover-opacity-100'}`
              }
            >
              Table Reservations
            </NavLink>
          </nav>
        </div>

        <div className="border-top border-secondary pt-3">
          <div className="small text-muted mb-2">Logged in as:</div>
          <div className="fw-semibold small text-truncate">{user?.email}</div>
          <div className="d-flex gap-2 mt-3">
            <Link to="/" className="btn btn-outline-light btn-sm flex-grow-1">
              Main Site ↗
            </Link>
            <button className="btn btn-outline-danger btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {}
      <main className="flex-grow-1 p-4 p-md-5 overflow-auto">
        <Outlet />
      </main>

    </div>
  );
}
