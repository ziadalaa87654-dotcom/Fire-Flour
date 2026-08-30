import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import reservationService from '../services/reservationService';

export default function Reservation() {
  const { showToast, showModal } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '',
    name: '',
    email: '',
    notes: '',
  });

  const [invalidFields, setInvalidFields] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (invalidFields[name]) {
      setInvalidFields((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.name.trim()) errors.name = true;
    if (!formData.email.trim()) errors.email = true;
    if (!formData.date) errors.date = true;
    if (!formData.time) errors.time = true;
    if (!formData.guests) errors.guests = true;

    setInvalidFields(errors);

    if (Object.keys(errors).length > 0) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setInvalidFields({ email: true });
      showToast('Please provide a valid email address.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      
      await reservationService.createReservation(formData);

      const dateParts = formData.date.split('-');
      const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const summaryContent = (
        <div>
          <p>
            Thank you, <strong>{formData.name}</strong>! Your table reservation request has been sent to our management team.
          </p>
          <div className="modal-details">
            <p>
              <strong>Date:</strong> {formattedDate}
            </p>
            <p>
              <strong>Time:</strong> {formData.time}
            </p>
            <p>
              <strong>Party Size:</strong> {formData.guests}
            </p>
            <p>
              <strong>Confirmation Email:</strong> {formData.email}
            </p>
            {formData.notes && (
              <p>
                <strong>Special Notes:</strong> {formData.notes}
              </p>
            )}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: 0 }}>
            Our team will confirm your table shortly.
          </p>
        </div>
      );

      showModal('Table Reserved!', summaryContent);
      showToast('Reservation request sent!', 'success');

      setFormData({
        date: '',
        time: '',
        guests: '',
        name: '',
        email: '',
        notes: '',
      });
    } catch (err) {
      showToast('Failed to send reservation request.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow dark">YOUR TABLE AWAITS</p>
          <h1>
            Let's make<br />
            it <em>special.</em>
          </h1>
        </div>
      </section>

      <section className="reservation section">
        <div className="container reservation-box">
          <div className="reservation-copy">
            <p className="eyebrow dark">RESERVATIONS</p>
            <h2>
              Save your<br />
              seat.
            </h2>
            <p>Complete the form and we'll get back to you to confirm your reservation.</p>
            <p className="small-note">For groups larger than 8, please contact us directly.</p>
          </div>

          <form id="reservationForm" className="reservation-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label>
                Date
                <input
                  type="date"
                  name="date"
                  min={todayStr}
                  max={maxDateStr}
                  value={formData.date}
                  onChange={handleChange}
                  className={invalidFields.date ? 'invalid' : ''}
                  required
                />
              </label>
              <label>
                Time
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={invalidFields.time ? 'invalid' : ''}
                  required
                >
                  <option value="">Select time</option>
                  <option value="18:00">18:00</option>
                  <option value="18:30">18:30</option>
                  <option value="19:00">19:00</option>
                  <option value="19:30">19:30</option>
                  <option value="20:00">20:00</option>
                  <option value="20:30">20:30</option>
                  <option value="21:00">21:00</option>
                </select>
              </label>
            </div>

            <div className="form-row">
              <label>
                Guests
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className={invalidFields.guests ? 'invalid' : ''}
                  required
                >
                  <option value="">Guests</option>
                  <option value="1 person">1 person</option>
                  <option value="2 people">2 people</option>
                  <option value="3 people">3 people</option>
                  <option value="4 people">4 people</option>
                  <option value="5 people">5 people</option>
                  <option value="6 people">6 people</option>
                  <option value="7 people">7 people</option>
                  <option value="8 people">8 people</option>
                </select>
              </label>
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className={invalidFields.name ? 'invalid' : ''}
                  required
                />
              </label>
            </div>

            <label>
              Email
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={invalidFields.email ? 'invalid' : ''}
                required
              />
            </label>

            <label>
              Notes
              <textarea
                name="notes"
                rows="4"
                placeholder="Birthday, special request..."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </label>

            <button className="btn btn-dark" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Request reservation ↗'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
