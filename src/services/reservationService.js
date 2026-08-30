import { apiRequest } from './apiClient';

const RESERVATIONS_STORAGE_KEY = 'fire_flour_reservations';

const INITIAL_RESERVATIONS = [
  {
    id: 'res_101',
    name: 'Ziad Alaa',
    email: 'ziad@gmail.com',
    date: '2026-08-28',
    time: '19:30',
    guests: '4 people',
    notes: 'Window table requested for anniversary dinner.',
    status: 'Pending',
    createdAt: '2026-08-26T12:00:00.000Z',
  },
  {
    id: 'res_102',
    name: 'Sofia Martinez',
    email: 'sofia@example.com',
    date: '2026-08-27',
    time: '20:00',
    guests: '2 people',
    notes: 'Celebrating birthday.',
    status: 'Confirmed',
    createdAt: '2026-08-25T16:45:00.000Z',
  },
  {
    id: 'res_103',
    name: 'Chef Marco',
    email: 'marco@freshmart.com',
    date: '2026-08-29',
    time: '18:30',
    guests: '6 people',
    notes: 'VIP family reservation.',
    status: 'Confirmed',
    createdAt: '2026-08-24T11:15:00.000Z',
  },
  {
    id: 'res_104',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    date: '2026-08-26',
    time: '21:00',
    guests: '2 people',
    notes: 'Late evening table.',
    status: 'Cancelled',
    createdAt: '2026-08-23T09:30:00.000Z',
  }
];

function getStoredReservations() {
  const data = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(INITIAL_RESERVATIONS));
    return INITIAL_RESERVATIONS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_RESERVATIONS;
  }
}

function saveStoredReservations(list) {
  localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(list));
}

export const reservationService = {
  async getReservations() {
    try {
      const data = await apiRequest('/reservations', 'GET');
      const list = data.reservations || (Array.isArray(data) ? data : []);
      if (Array.isArray(list) && list.length > 0) return list;
    } catch (err) {
      
    }
    return getStoredReservations();
  },

  async createReservation(reservationData) {
    const payload = {
      name: reservationData.name.trim(),
      email: reservationData.email.trim().toLowerCase(),
      date: reservationData.date,
      time: reservationData.time,
      guests: reservationData.guests,
      notes: reservationData.notes ? reservationData.notes.trim() : '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const data = await apiRequest('/reservations', 'POST', payload);
      if (data.reservation || data.id) {
        return data.reservation || data;
      }
    } catch (err) {
      
    }

    const reservations = getStoredReservations();
    const newReservation = {
      id: `res_${Date.now()}`,
      ...payload,
    };
    reservations.unshift(newReservation);
    saveStoredReservations(reservations);
    return newReservation;
  },

  async updateReservationStatus(id, newStatus) {
    try {
      const data = await apiRequest(`/reservations/${id}/status`, 'PATCH', { status: newStatus });
      if (data.reservation) return data.reservation;
    } catch (err) {
      
    }

    const reservations = getStoredReservations();
    const index = reservations.findIndex((r) => String(r.id) === String(id));
    if (index === -1) throw new Error('Reservation request not found');

    reservations[index].status = newStatus;
    saveStoredReservations(reservations);
    return reservations[index];
  },

  async deleteReservation(id) {
    try {
      await apiRequest(`/reservations/${id}`, 'DELETE');
      return true;
    } catch (err) {
      
    }

    const reservations = getStoredReservations();
    const filtered = reservations.filter((r) => String(r.id) !== String(id));
    saveStoredReservations(filtered);
    return true;
  },
};

export default reservationService;
