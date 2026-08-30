import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import userService from '../../services/userService';
import reservationService from '../../services/reservationService';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [pData, uData, rData] = await Promise.all([
          productService.getProducts(),
          userService.getUsers(),
          reservationService.getReservations(),
        ]);
        setProducts(pData);
        setUsers(uData);
        setReservations(rData);
      } catch (e) {
        console.error('Failed to load dashboard metrics', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalPizza = products.filter((p) => p.category === 'pizza').length;
  const totalPasta = products.filter((p) => p.category === 'pasta').length;
  const adminUsersCount = users.filter((u) => u.role === 'admin').length;
  const pendingReservations = reservations.filter((r) => r.status === 'Pending').length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold font-serif mb-1" style={{ color: '#171714' }}>Dashboard Overview</h2>
          <p className="text-muted small mb-0">Welcome back to the Fire & Flour Admin Panel</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/reservations" className="btn btn-warning btn-sm px-3 fw-bold text-dark">
            Table Reservations ({pendingReservations} Pending)
          </Link>
          <Link to="/admin/products" className="btn btn-danger btn-sm px-3 fw-bold">
            + Manage Products
          </Link>
          <Link to="/admin/users" className="btn btn-dark btn-sm px-3">
            Manage Users
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status" />
        </div>
      ) : (
        <>
          {}
          <div className="row g-3 mb-5">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm p-3 h-100" style={{ background: '#fff', borderRadius: '12px' }}>
                <div className="text-muted small fw-semibold">TOTAL PRODUCTS</div>
                <div className="display-6 fw-bold text-danger my-1">{products.length}</div>
                <div className="small text-muted">{totalPizza} Pizzas, {totalPasta} Pastas</div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm p-3 h-100" style={{ background: '#fff', borderRadius: '12px' }}>
                <div className="text-muted small fw-semibold">REGISTERED USERS</div>
                <div className="display-6 fw-bold text-dark my-1">{users.length}</div>
                <div className="small text-muted">{adminUsersCount} Admin, {users.length - adminUsersCount} Customers</div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm p-3 h-100" style={{ background: '#fff', borderRadius: '12px' }}>
                <div className="text-muted small fw-semibold text-warning">TABLE RESERVATIONS</div>
                <div className="display-6 fw-bold text-warning my-1">{reservations.length}</div>
                <div className="small text-muted">{pendingReservations} Pending Approvals</div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm p-3 h-100" style={{ background: '#fff', borderRadius: '12px' }}>
                <div className="text-muted small fw-semibold text-success">BACKEND API & AUTH</div>
                <div className="h5 fw-bold text-success my-2">✓ Active & Secured</div>
                <div className="small text-muted">JWT & REST Endpoints Active</div>
              </div>
            </div>
          </div>

          {}
          <div className="row g-4">
            <div className="col-12 col-lg-7">
              <div className="card border-0 shadow-sm p-4" style={{ background: '#fff', borderRadius: '12px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Recent Products</h5>
                  <Link to="/admin/products" className="small text-danger fw-bold text-decoration-none">View All ↗</Link>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th>Dish</th>
                        <th>Category</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.slice(0, 5).map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {p.image && (
                                <img src={p.image} alt={p.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />
                              )}
                              <div>
                                <div className="fw-semibold text-dark small">{p.name}</div>
                                <div className="text-muted small text-truncate" style={{ maxWidth: '200px', fontSize: '11px' }}>{p.desc}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-secondary text-uppercase" style={{ fontSize: '10px' }}>{p.category}</span>
                          </td>
                          <td className="fw-bold text-danger">€{Number(p.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="card border-0 shadow-sm p-4" style={{ background: '#fff', borderRadius: '12px' }}>
                <h5 className="fw-bold mb-3">Project Quick Links</h5>
                <div className="d-flex flex-column gap-2">

                  <Link to="/menu" className="p-3 border rounded-3 text-decoration-none text-dark d-flex justify-content-between align-items-center bg-light">
                    <div>
                      <div className="fw-bold">Live Customer Menu</div>
                      <div className="small text-muted">Test product updates in real-time</div>
                    </div>
                    <span>↗</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
