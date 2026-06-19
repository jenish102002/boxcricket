import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '../../api/analytics'
import { KPICard } from '../../components/analytics/KPICard'
import RevenueChart from '../../components/analytics/RevenueChart'
import VenueChart from '../../components/analytics/VenueChart'
import StatusDonut from '../../components/analytics/StatusDonut'
import { Skeleton } from '../../components/ui/Skeleton'
import { bookingApi } from '../../api/bookings'
import { Badge } from '../../components/ui/Badge'
import { IndianRupee, CalendarCheck, TrendingUp, Building2, Clock } from 'lucide-react'
import { format, subDays } from 'date-fns'
import { useState } from 'react'

const ranges = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
]

export default function DashboardPage() {
  const [range, setRange] = useState(30)

  const endDate = format(new Date(), 'yyyy-MM-dd')
  const startDate = format(subDays(new Date(), range), 'yyyy-MM-dd')

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: analyticsApi.getSummary,
  })

  const { data: revenue, isLoading: revenueLoading } = useQuery({
    queryKey: ['analytics-revenue', startDate, endDate],
    queryFn: () => analyticsApi.getRevenue(startDate, endDate),
  })

  const { data: byVenue } = useQuery({
    queryKey: ['analytics-by-venue'],
    queryFn: analyticsApi.getByVenue,
  })

  const { data: slotStatus } = useQuery({
    queryKey: ['analytics-slot-status'],
    queryFn: analyticsApi.getSlotStatus,
  })

  const { data: recentBookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: bookingApi.getAll,
    select: (data) => data.slice(0, 8),
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-fraunces text-3xl font-bold text-ink mb-1">Dashboard</h1>
        <p className="text-muted text-sm">Revenue, bookings, and platform health at a glance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            <KPICard
              label="Total Revenue"
              value={summary?.totalRevenue}
              format="currency"
              icon={IndianRupee}
              trendLabel="All time confirmed"
            />
            <KPICard
              label="Total Bookings"
              value={summary?.totalBookings}
              icon={CalendarCheck}
              trendLabel="Confirmed bookings"
            />
            <KPICard
              label="Occupancy Rate"
              value={summary?.occupancyRate}
              format="percent"
              icon={TrendingUp}
              trend={summary?.occupancyRate > 50 ? 1 : -1}
              trendLabel={summary?.occupancyRate > 50 ? 'Good occupancy' : 'Below target'}
            />
            <KPICard
              label="Active Venues"
              value={summary?.activeVenues}
              icon={Building2}
              trendLabel="Live venues"
            />
          </>
        )}
      </div>

      {/* Revenue Chart */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-fraunces text-xl font-semibold text-ink">Revenue over time</h2>
            <p className="text-muted text-xs mt-0.5">Confirmed bookings only</p>
          </div>
          <div className="flex gap-1 bg-surface-alt rounded-input p-1">
            {ranges.map(r => (
              <button
                key={r.days}
                onClick={() => setRange(r.days)}
                className={`px-3 py-1.5 text-xs font-medium rounded-input transition-all ${
                  range === r.days ? 'bg-surface text-ink shadow-soft' : 'text-muted hover:text-ink'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        {revenueLoading ? <Skeleton className="h-64" /> : <RevenueChart data={revenue || []} />}
      </div>

      {/* Two columns: bar chart + donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-fraunces text-xl font-semibold text-ink mb-5">Revenue by venue</h2>
          <VenueChart data={byVenue || []} />
        </div>
        <div className="card">
          <h2 className="font-fraunces text-xl font-semibold text-ink mb-5">Slot status</h2>
          <StatusDonut data={slotStatus || []} />
        </div>
      </div>

      {/* Recent bookings table */}
      <div className="card">
        <h2 className="font-fraunces text-xl font-semibold text-ink mb-5">Recent bookings</h2>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Venue</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings?.map(b => (
                <tr key={b.id}>
                  <td className="font-mono text-muted text-xs">#{b.id}</td>
                  <td>
                    <p className="font-medium text-ink">{b.userName}</p>
                    <p className="text-xs text-muted">{b.userEmail}</p>
                  </td>
                  <td>{b.venueName}</td>
                  <td className="font-mono text-sm whitespace-nowrap">
                    {format(new Date(b.slotDate), 'd MMM')} · {b.slotStartTime}
                  </td>
                  <td className="font-mono text-sm">₹{parseFloat(b.amount).toLocaleString('en-IN')}</td>
                  <td><Badge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
