import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"
      >
        {toasts.map(t => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 bg-surface border border-border rounded-card shadow-card px-4 py-3 min-w-72 max-w-sm animate-slide-up"
          >
            {t.type === 'success' && <CheckCircle size={18} className="text-teal mt-0.5 shrink-0" />}
            {t.type === 'error' && <XCircle size={18} className="text-danger mt-0.5 shrink-0" />}
            {t.type === 'warning' && <AlertCircle size={18} className="text-accent mt-0.5 shrink-0" />}
            <span className="text-sm text-ink flex-1">{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              className="text-muted hover:text-ink transition-colors"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
