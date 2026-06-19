import { NavLink } from 'react-router-dom'
import { LayoutDashboard, MapPin, Clock, CalendarCheck, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/venues', label: 'Venues', icon: MapPin },
  { to: '/admin/slots', label: 'Slots', icon: Clock },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
]

export default function AdminSidebar() {
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="w-64 shrink-0 bg-surface border-r border-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">BC</span>
          </div>
          <div>
            <span className="font-fraunces font-semibold text-ink text-sm block">BoxCricket</span>
            <span className="text-xs text-muted">Admin Dashboard</span>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-6" aria-label="Admin navigation">
        <ul className="space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-input text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted hover:text-ink hover:bg-surface-alt'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer: user info + logout */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-2 px-3 py-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-semibold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-ink truncate">{user?.name}</p>
            <p className="text-xs text-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-danger rounded-input transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
