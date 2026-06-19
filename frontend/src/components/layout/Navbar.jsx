import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { LogOut, User, CalendarCheck, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { token, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  return (
    <nav className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">BC</span>
            </div>
            <span className="font-fraunces font-semibold text-ink text-lg tracking-tight">BoxCricket</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/venues"
              className="px-4 py-2 text-sm font-medium text-muted hover:text-ink rounded-input transition-colors"
            >
              Venues
            </Link>
            {token && (
              <Link
                to="/my-bookings"
                className="px-4 py-2 text-sm font-medium text-muted hover:text-ink rounded-input transition-colors flex items-center gap-1.5"
              >
                <CalendarCheck size={15} />
                My Bookings
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="px-4 py-2 text-sm font-medium text-muted hover:text-ink rounded-input transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard size={15} />
                Admin
              </Link>
            )}
          </div>

          {/* Auth actions */}
          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-alt rounded-pill text-sm">
                  <User size={14} className="text-muted" />
                  <span className="text-ink font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted hover:text-danger transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm px-4 py-2">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-muted hover:text-ink rounded-input"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-4 flex flex-col gap-1">
          <Link to="/venues" className="px-4 py-3 text-sm text-ink hover:bg-surface-alt rounded-input" onClick={() => setMobileOpen(false)}>Venues</Link>
          {token && (
            <Link to="/my-bookings" className="px-4 py-3 text-sm text-ink hover:bg-surface-alt rounded-input flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <CalendarCheck size={15} /> My Bookings
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="px-4 py-3 text-sm text-ink hover:bg-surface-alt rounded-input flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <LayoutDashboard size={15} /> Admin Dashboard
            </Link>
          )}
          <div className="border-t border-border mt-2 pt-3">
            {token ? (
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-danger flex items-center gap-2">
                <LogOut size={15} /> Sign out ({user?.name})
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="btn-secondary text-center text-sm" onClick={() => setMobileOpen(false)}>Sign in</Link>
                <Link to="/register" className="btn-primary text-center text-sm" onClick={() => setMobileOpen(false)}>Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
