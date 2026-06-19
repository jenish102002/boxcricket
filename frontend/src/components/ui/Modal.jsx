import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (isOpen) {
      el.showModal?.()
      document.body.style.overflow = 'hidden'
    } else {
      el.close?.()
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className={`relative bg-surface rounded-card shadow-card w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 id="modal-title" className="font-fraunces text-xl font-semibold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-input text-muted hover:text-ink hover:bg-surface-alt transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
