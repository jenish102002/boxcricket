import api from './axios'

export const analyticsApi = {
  getSummary: () => api.get('/analytics/summary').then(r => r.data.data),
  getRevenue: (startDate, endDate) =>
    api.get('/analytics/revenue', { params: { startDate, endDate } }).then(r => r.data.data),
  getByVenue: () => api.get('/analytics/by-venue').then(r => r.data.data),
  getSlotStatus: () => api.get('/analytics/slot-status').then(r => r.data.data),
}
