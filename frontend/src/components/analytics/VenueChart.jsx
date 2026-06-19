import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

export default function VenueChart({ data = [] }) {
  const formatted = data.map(d => ({
    name: d.venueName?.split(' ').slice(0, 2).join(' ') || d.venueName,
    revenue: parseFloat(d.revenue || 0),
    bookings: parseInt(d.bookings || 0),
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={formatted} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E0" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#6B6B6B', fontSize: 11, fontFamily: 'Inter' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6B6B6B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          width={44}
        />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #E8E6E0',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            fontFamily: 'Inter',
            fontSize: 12,
          }}
          formatter={(value) => [`₹${parseFloat(value).toLocaleString('en-IN')}`, 'Revenue']}
        />
        <Bar dataKey="revenue" fill="#E07A5F" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
