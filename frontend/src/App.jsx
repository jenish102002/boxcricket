import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layouts
import PublicLayout from './components/layout/PublicLayout'
import AdminLayout from './components/layout/AdminLayout'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Public pages
import HomePage from './pages/public/HomePage'
import VenuesPage from './pages/public/VenuesPage'
import VenueDetailPage from './pages/public/VenueDetailPage'
import MyBookingsPage from './pages/public/MyBookingsPage'
import BookingConfirmPage from './pages/public/BookingConfirmPage'

// Admin pages
import DashboardPage from './pages/admin/DashboardPage'
import AdminVenuesPage from './pages/admin/AdminVenuesPage'
import AdminSlotsPage from './pages/admin/AdminSlotsPage'
import AdminBookingsPage from './pages/admin/AdminBookingsPage'

// Route guards
function ProtectedRoute({ children, requireAdmin = false }) {
  const { token, user } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (requireAdmin && user?.role !== 'ADMIN') return <Navigate to="/" replace />
  return children
}

function GuestRoute({ children }) {
  const { token } = useAuthStore()
  if (token) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Guest-only */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Public app */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/venues" element={<VenuesPage />} />
        <Route path="/venues/:id" element={<VenueDetailPage />} />
        <Route path="/booking/confirm" element={
          <ProtectedRoute><BookingConfirmPage /></ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
        } />
      </Route>

      {/* Admin dashboard */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="venues" element={<AdminVenuesPage />} />
        <Route path="slots" element={<AdminSlotsPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
