import api from './axios'

export const slotApi = {
  getByVenue: (venueId, date) => {
    const params = date ? { date } : {}
    return api.get(`/venues/${venueId}/slots`, { params }).then(r => r.data.data)
  },
  getAll: () => api.get('/slots').then(r => r.data.data),
  getById: (id) => api.get(`/slots/${id}`).then(r => r.data.data),
  create: (data) => api.post('/slots', data).then(r => r.data.data),
  bulkCreate: (data) => api.post('/slots/bulk', data).then(r => r.data.data),
  update: (id, data) => api.put(`/slots/${id}`, data).then(r => r.data.data),
  delete: (id) => api.delete(`/slots/${id}`).then(r => r.data),
}
