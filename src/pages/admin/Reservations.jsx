import React, { useEffect, useState, useMemo } from 'react';
import reservationService from '../../services/reservationService';
import { useApp } from '../../context/AppContext';

export default function Reservations() {
  const { showToast } = useApp();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await reservationService.getReservations();
      setReservations(data);
    } catch (err) {
      showToast('Failed to fetch reservations', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const matchesStatus = activeStatus === 'all' || r.status.toLowerCase() === activeStatus.toLowerCase();
      const text = `${r.name} ${r.email} ${r.date} ${r.time} ${r.guests} ${r.notes || ''}`.toLowerCase();
      const matchesSearch = !searchQuery || text.includes(searchQuery.toLowerCase().trim());
      return matchesStatus && matchesSearch;
    });
  }, [reservations, activeStatus, searchQuery]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await reservationService.updateReservationStatus(id, newStatus);
      showToast(`Reservation status set to ${newStatus.toUpperCase()}`, 'success');
      fetchReservations();
    } catch (err) {
      showToast('Failed to update reservation status', 'danger');
    }
  };

  const handleDelete = async (r) => {
    if (window.confirm(`Are you sure you want to delete reservation for "${r.name}" on ${r.date}?`)) {
      try {
        await reservationService.deleteReservation(r.id);
        showToast('Reservation deleted', 'success');
        fetchReservations();
      } catch (err) {
        showToast('Failed to delete reservation', 'danger');
      }
    }
  };

  const totalPending = reservations.filter((r) => r.status === 'Pending').length;
  const totalConfirmed = reservations.filter((r) => r.status === 'Confirmed').length;
  const totalCancelled = reservations.filter((r) => r.status === 'Cancelled').length;

  return (
    <div>
      {}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold font-serif mb-1" style={{ color: '#171714' }}>Table Reservations</h2>
          <p className="text-muted small mb-0">View, manage, confirm, or cancel customer table booking requests</p>
        </div>
      </div>

      {}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100 bg-white" style={{ borderRadius: '12px' }}>
            <div className="text-muted small fw-semibold">TOTAL REQUESTS</div>
            <div className="display-6 fw-bold text-dark my-1">{reservations.length}</div>
            <div className="small text-muted">All time bookings</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100 bg-white" style={{ borderRadius: '12px' }}>
            <div className="text-muted small fw-semibold text-warning">PENDING APPROVAL</div>
            <div className="display-6 fw-bold text-warning my-1">{totalPending}</div>
            <div className="small text-muted">Requires staff response</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100 bg-white" style={{ borderRadius: '12px' }}>
            <div className="text-muted small fw-semibold text-success">CONFIRMED TABLES</div>
            <div className="display-6 fw-bold text-success my-1">{totalConfirmed}</div>
            <div className="small text-muted">Ready for guests</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100 bg-white" style={{ borderRadius: '12px' }}>
            <div className="text-muted small fw-semibold text-danger">CANCELLED</div>
            <div className="display-6 fw-bold text-danger my-1">{totalCancelled}</div>
            <div className="small text-muted">Cancelled bookings</div>
          </div>
        </div>
      </div>

      {}
      <div className="card border-0 shadow-sm p-3 mb-4 bg-white" style={{ borderRadius: '12px' }}>
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="btn-group w-100" role="group">
              {['all', 'Pending', 'Confirmed', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`btn btn-sm text-capitalize ${activeStatus.toLowerCase() === st.toLowerCase() ? 'btn-danger fw-bold' : 'btn-outline-secondary'}`}
                  onClick={() => setActiveStatus(st)}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="col-12 col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search reservations by customer, date, email, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {}
      <div className="card border-0 shadow-sm bg-white" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status" />
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p className="mb-0">No reservation requests found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Customer</th>
                  <th>Date & Time</th>
                  <th>Party Size</th>
                  <th>Special Notes</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="fw-bold text-dark">{r.name}</div>
                      <div className="text-muted small" style={{ fontSize: '12px' }}>{r.email}</div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{r.date}</div>
                      <div className="text-danger small fw-bold">🕒 {r.time}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border px-2 py-1">👥 {r.guests}</span>
                    </td>
                    <td>
                      <div className="small text-muted text-truncate" style={{ maxWidth: '240px' }}>
                        {r.notes || <em className="text-secondary opacity-50">No notes provided</em>}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        r.status === 'Confirmed' ? 'bg-success' :
                        r.status === 'Pending' ? 'bg-warning text-dark' : 'bg-danger'
                      }`} style={{ fontSize: '11px' }}>
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-end pe-4 text-nowrap">
                      {r.status !== 'Confirmed' && (
                        <button
                          className="btn btn-sm btn-success me-1 text-white"
                          onClick={() => handleStatusChange(r.id, 'Confirmed')}
                          title="Confirm Table"
                        >
                          ✓ Confirm
                        </button>
                      )}
                      {r.status !== 'Cancelled' && (
                        <button
                          className="btn btn-sm btn-outline-warning me-1 text-dark"
                          onClick={() => handleStatusChange(r.id, 'Cancelled')}
                          title="Cancel Reservation"
                        >
                          ✕ Cancel
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(r)}
                        title="Delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
