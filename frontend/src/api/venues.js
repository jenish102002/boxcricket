import api from './axios'

export const venueApi = {
  getAll: (params) => api.get('/venues', { params }).then(r => r.data.data),
  getAllAdmin: () => api.get('/venues/all').then(r => r.data.data),
  getById: (id) => api.get(`/venues/${id}`).then(r => r.data.data),
  create: (data) => api.post('/venues', data).then(r => r.data.data),
  update: (id, data) => api.put(`/venues/${id}`, data).then(r => r.data.data),
  delete: (id) => api.delete(`/venues/${id}`).then(r => r.data),
}
