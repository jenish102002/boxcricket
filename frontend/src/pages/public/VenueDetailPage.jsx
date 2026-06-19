import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { venueApi } from '../../api/venues'
import { bookingApi } from '../../api/bookings'
import { useAuthStore } from '../../store/authStore'
import SlotPicker from '../../components/slot/SlotPicker'
import { Modal } from '../../components/ui/Modal'
import { Skeleton } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { MapPin, IndianRupee, Clock, ArrowLeft, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

export default function VenueDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, user } = useAuthStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const { data: venue, isLoading } = useQuery({
    queryKey: ['venue', id],
    queryFn: () => venueApi.getById(id),
  })

  const bookMutation = useMutation({
    mutationFn: () => bookingApi.create({ slotId: selectedSlot.id }),
    onSuccess: (booking) => {
      toast('Booking confirmed! 🎉', 'success')
      queryClient.invalidateQueries(['slots', id])
      queryClient.invalidateQueries(['my-bookings'])
      setShowConfirmModal(false)
      navigate('/booking/confirm', { state: { booking } })
    },
    onError: (err) => {
      toast(err?.response?.data?.message || 'Booking failed. Try again.', 'error')
      setShowConfirmModal(false)
    },
  })

  const handleBookClick = () => {
    if (!token) {
      navigate('/login')
      return
    }
    setShowConfirmModal(true)
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-72 w-full rounded-2xl mb-8" />
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-4 w-1/4 mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    )
  }

  if (!venue) return null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back */}
      <Link to="/venues" className="inline-flex items-center gap-2 text-muted text-sm hover:text-ink mb-8 transition-colors">
        <ArrowLeft size={14} /> Back to venues
      </Link>

      {/* Venue hero image */}
      <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden bg-surface-alt mb-8 shadow-card">
        {venue.imageUrl ? (
          <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-fraunces text-6xl text-muted/30">{venue.name.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Info */}
        <div className="lg:col-span-2">
          <h1 className="font-fraunces text-3xl md:text-4xl font-bold text-ink mb-2">{venue.name}</h1>
          <div className="flex items-center gap-1.5 text-muted mb-5">
            <MapPin size={14} />
            <span className="text-sm">{venue.location}</span>
          </div>
          {venue.description && (
            <p className="text-ink/70 text-base leading-relaxed mb-8">{venue.description}</p>
          )}

          {/* Slot Picker */}
          <div className="bg-surface border border-border rounded-card p-6 shadow-soft">
            <h2 className="font-fraunces text-xl font-semibold text-ink mb-5">Select a time slot</h2>
            <SlotPicker
              venueId={id}
              selectedSlotId={selectedSlot?.id}
              onSlotSelect={setSelectedSlot}
            />
          </div>
        </div>

        {/* Right: Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <div className="flex items-baseline gap-1 mb-5">
              <IndianRupee size={18} className="text-accent" />
              <span className="font-mono text-3xl font-semibold text-accent">
                {parseFloat(venue.pricePerSlot).toLocaleString('en-IN')}
              </span>
              <span className="text-muted text-sm">/slot</span>
            </div>

            {selectedSlot ? (
              <div className="bg-surface-alt rounded-input p-4 mb-5 border border-border">
                <p className="text-xs text-muted font-medium uppercase tracking-wider mb-2">Selected slot</p>
                <div className="flex items-center gap-2 text-ink font-medium">
                  <Clock size={14} className="text-accent" />
                  <span>{format(new Date(selectedSlot.date), 'd MMM yyyy')}</span>
                </div>
                <p className="text-sm text-muted ml-5">{selectedSlot.startTime} – {selectedSlot.endTime}</p>
              </div>
            ) : (
              <p className="text-muted text-sm mb-5">Select a slot from the calendar to proceed.</p>
            )}

            <button
              onClick={handleBookClick}
              disabled={!selectedSlot}
              className="btn-primary w-full justify-center text-base py-3.5"
            >
              {!token ? 'Sign in to Book' : 'Book This Slot'}
            </button>

            <p className="text-center text-xs text-muted mt-3">No cancellation fees for future bookings</p>
          </div>
        </div>
      </div>

      {/* Booking confirmation modal */}
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="Confirm Booking">
        <div className="space-y-4">
          <div className="bg-surface-alt rounded-input p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Venue</span>
              <span className="text-ink font-medium">{venue.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Date</span>
              <span className="text-ink font-medium">{selectedSlot && format(new Date(selectedSlot.date), 'd MMMM yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Time</span>
              <span className="text-ink font-medium">{selectedSlot?.startTime} – {selectedSlot?.endTime}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 mt-2">
              <span className="text-muted">Total</span>
              <span className="font-mono font-semibold text-accent">
                ₹{parseFloat(venue.pricePerSlot).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="btn-secondary flex-1 justify-center"
            >
              Cancel
            </button>
            <button
              onClick={() => bookMutation.mutate()}
              disabled={bookMutation.isPending}
              className="btn-primary flex-1 justify-center"
            >
              {bookMutation.isPending ? 'Booking…' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
