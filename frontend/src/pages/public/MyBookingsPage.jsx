import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingApi } from '../../api/bookings'
import { Badge } from '../../components/ui/Badge'
import { SkeletonRow } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { useToast } from '../../components/ui/Toast'
import { CalendarCheck, MapPin, Clock, IndianRupee, X } from 'lucide-react'
import { format } from 'date-fns'
import clsx from 'clsx'

export default function MyBookingsPage() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: bookingApi.getMy,
  })
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const cancelMutation = useMutation({
    mutationFn: bookingApi.cancel,
    onSuccess: () => {
      toast('Booking cancelled successfully', 'success')
      queryClient.invalidateQueries(['my-bookings'])
    },
    onError: (err) => {
      toast(err?.response?.data?.message || 'Could not cancel booking', 'error')
    },
  })

  const canCancel = (booking) =>
    booking.status === 'CONFIRMED' &&
    new Date(booking.slotDate) >= new Date()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="page-title mb-2">My Bookings</h1>
      <p className="text-muted mb-10">Your booking history and upcoming reservations.</p>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card">
              <table className="w-full"><tbody><SkeletonRow /></tbody></table>
            </div>
          ))}
        </div>
      )}

      {!isLoading && bookings?.length === 0 && (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings yet"
          description="Head to our venues and book your first slot."
          action={<a href="/venues" className="btn-primary">Browse Venues</a>}
        />
      )}

      {!isLoading && bookings?.length > 0 && (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className={clsx(
              'card hover:shadow-card transition-shadow',
              booking.status === 'CANCELLED' && 'opacity-60'
            )}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge status={booking.status} />
                    <span className="text-xs text-muted font-mono">#{booking.id}</span>
                  </div>
                  <h3 className="font-fraunces text-lg font-semibold text-ink">{booking.venueName}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {booking.venueLocation}
                    </span>
                    <span className="hidden sm:block">·</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {format(new Date(booking.slotDate), 'd MMM yyyy')} · {booking.slotStartTime}–{booking.slotEndTime}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 justify-end mb-3">
                    <IndianRupee size={13} className="text-accent" />
                    <span className="font-mono font-semibold text-accent">
                      {parseFloat(booking.amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                  {canCancel(booking) && (
                    <button
                      onClick={() => cancelMutation.mutate(booking.id)}
                      disabled={cancelMutation.isPending}
                      className="inline-flex items-center gap-1 text-xs text-danger border border-danger/30 rounded-input px-3 py-1.5 hover:bg-danger/5 transition-colors"
                    >
                      <X size={12} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
