import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border rounded-card p-3 shadow-card text-sm">
        <p className="text-muted mb-1">{label}</p>
        <p className="font-mono font-semibold text-accent">
          ₹{parseFloat(payload[0].value).toLocaleString('en-IN')}
        </p>
        {payload[1] && (
          <p className="text-ink">{payload[1].value} bookings</p>
        )}
      </div>
    )
  }
  return null
}

export default function RevenueChart({ data = [] }) {
  const formatted = data.map(d => ({
    ...d,
    period: d.period ? format(new Date(d.period), 'MMM d') : d.period,
    revenue: parseFloat(d.revenue || 0),
    bookings: parseInt(d.bookings || 0),
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={formatted} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#E07A5F" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#E07A5F" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E0" vertical={false} />
        <XAxis
          dataKey="period"
          tick={{ fill: '#6B6B6B', fontSize: 11, fontFamily: 'Inter' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6B6B6B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#E07A5F"
          strokeWidth={2}
          fill="url(#revenueGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#E07A5F', stroke: '#FFF', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
