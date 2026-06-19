import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingApi } from '../../api/bookings'
import { useToast } from '../../components/ui/Toast'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { Modal } from '../../components/ui/Modal'
import { CalendarCheck, X } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminBookingsPage() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [statusFilter, setStatusFilter] = useState('')
  const [cancelTarget, setCancelTarget] = useState(null)

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings-all'],
    queryFn: bookingApi.getAll,
  })

  const cancelMutation = useMutation({
    mutationFn: bookingApi.cancel,
    onSuccess: () => {
      toast('Booking cancelled', 'success')
      queryClient.invalidateQueries(['admin-bookings-all'])
      queryClient.invalidateQueries(['analytics-summary'])
      setCancelTarget(null)
    },
    onError: (e) => toast(e?.response?.data?.message || 'Cancel failed', 'error'),
  })

  const filtered = statusFilter
    ? bookings?.filter(b => b.status === statusFilter)
    : bookings

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-fraunces text-3xl font-bold text-ink mb-1">All Bookings</h1>
        <p className="text-muted text-sm">View and manage all platform bookings.</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2">
        {['', 'CONFIRMED', 'CANCELLED'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 text-sm font-medium rounded-input border transition-all ${
              statusFilter === s
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-muted hover:text-ink'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-muted font-mono">
          {filtered?.length || 0} bookings
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
      ) : filtered?.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="No bookings" description="No bookings match this filter." />
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Venue</th>
                  <th>Slot</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id}>
                    <td className="font-mono text-muted text-xs">#{b.id}</td>
                    <td>
                      <p className="font-medium text-ink">{b.userName}</p>
                      <p className="text-xs text-muted">{b.userEmail}</p>
                    </td>
                    <td>{b.venueName}</td>
                    <td className="whitespace-nowrap font-mono text-xs">
                      {format(new Date(b.slotDate), 'd MMM yyyy')}<br />
                      {b.slotStartTime}–{b.slotEndTime}
                    </td>
                    <td className="font-mono font-medium text-accent">
                      ₹{parseFloat(b.amount).toLocaleString('en-IN')}
                    </td>
                    <td><Badge status={b.status} /></td>
                    <td>
                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => setCancelTarget(b)}
                          className="inline-flex items-center gap-1 text-xs text-danger border border-danger/30 rounded-input px-2.5 py-1 hover:bg-danger/5 transition-colors"
                        >
                          <X size={12} /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cancel confirmation modal */}
      <Modal isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)} title="Cancel Booking" size="sm">
        <p className="text-ink mb-2">Cancel booking <strong>#{cancelTarget?.id}</strong> for <strong>{cancelTarget?.userName}</strong>?</p>
        <p className="text-muted text-sm mb-6">The slot will be freed up for other users.</p>
        <div className="flex gap-3">
          <button onClick={() => setCancelTarget(null)} className="btn-secondary flex-1 justify-center">Keep</button>
          <button
            onClick={() => cancelMutation.mutate(cancelTarget.id)}
            disabled={cancelMutation.isPending}
            className="btn-danger flex-1 justify-center"
          >
            {cancelMutation.isPending ? 'Cancelling…' : 'Cancel Booking'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
