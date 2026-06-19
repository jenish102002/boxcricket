import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { ToastProvider } from '../ui/Toast'

export default function PublicLayout() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-bg">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <footer className="border-t border-border mt-20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="font-fraunces text-lg font-medium text-ink mb-1">BoxCricket</p>
            <p className="text-sm text-muted">© {new Date().getFullYear()} BoxCricket. Book smarter, play better.</p>
          </div>
        </footer>
      </div>
    </ToastProvider>
  )
}
