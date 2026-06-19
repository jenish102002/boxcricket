import api from './axios'

export const bookingApi = {
  create: (data) => api.post('/bookings', data).then(r => r.data.data),
  getMy: () => api.get('/bookings/me').then(r => r.data.data),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`).then(r => r.data.data),
  getAll: () => api.get('/bookings').then(r => r.data.data),
}
