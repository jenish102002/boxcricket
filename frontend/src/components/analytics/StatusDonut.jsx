import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = {
  AVAILABLE: '#2A9D8F',
  BOOKED: '#E07A5F',
  BLOCKED: '#D1495B',
}

export default function StatusDonut({ data = [] }) {
  const formatted = data.map(d => ({
    name: d.status,
    value: parseInt(d.count || 0),
    color: COLORS[d.status] || '#6B6B6B',
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={formatted}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={88}
          paddingAngle={3}
          dataKey="value"
        >
          {formatted.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #E8E6E0',
            borderRadius: '12px',
            fontFamily: 'Inter',
            fontSize: 12,
          }}
          formatter={(value, name) => [value.toLocaleString(), name]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ color: '#1A1A1A', fontFamily: 'Inter', fontSize: 12 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
