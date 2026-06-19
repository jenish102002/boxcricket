import { PackageOpen } from 'lucide-react'

export function EmptyState({ icon: Icon = PackageOpen, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-surface-alt flex items-center justify-center mb-4">
        <Icon size={28} className="text-muted" />
      </div>
      <h3 className="font-fraunces text-xl font-semibold text-ink mb-2">{title}</h3>
      {description && <p className="text-muted text-sm max-w-xs mb-6">{description}</p>}
      {action && action}
    </div>
  )
}
