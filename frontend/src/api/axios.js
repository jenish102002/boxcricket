import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Configure NProgress (disable the spinner for a cleaner look)
NProgress.configure({ showSpinner: false })

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: attach JWT & start progress ───────────────
api.interceptors.request.use((config) => {
  NProgress.start() // Start progress bar
  
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  NProgress.done()
  return Promise.reject(error)
})

// ── Response interceptor: 401 → logout & finish progress ───────────
api.interceptors.response.use(
  (response) => {
    NProgress.done() // Finish progress bar
    return response
  },
  (error) => {
    NProgress.done() // Finish progress bar on error
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
