import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import clsx from 'clsx'

export function KPICard({ label, value, trend, trendLabel, icon: Icon, format = 'number' }) {
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus
  const trendColor = trend > 0 ? 'text-teal' : trend < 0 ? 'text-danger' : 'text-muted'

  const formatted = format === 'currency'
    ? `₹${parseFloat(value || 0).toLocaleString('en-IN')}`
    : format === 'percent'
    ? `${value || 0}%`
    : (value || 0).toLocaleString()

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">{label}</p>
          <p className="kpi-number">{formatted}</p>
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-input bg-surface-alt flex items-center justify-center shrink-0">
            <Icon size={20} className="text-accent" />
          </div>
        )}
      </div>
      {trendLabel && (
        <div className={clsx('flex items-center gap-1 text-xs font-medium', trendColor)}>
          <TrendIcon size={12} />
          <span>{trendLabel}</span>
        </div>
      )}
    </div>
  )
}
