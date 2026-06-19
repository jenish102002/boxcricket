import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import { ToastProvider } from '../ui/Toast'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-bg">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setSidebarOpen(false)} />
            <div className="relative z-10">
              <AdminSidebar />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-surface border-b border-border sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-muted hover:text-ink rounded-input"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <span className="font-fraunces font-semibold text-ink">Admin Dashboard</span>
          </div>

          <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
