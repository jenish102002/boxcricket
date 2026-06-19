import { useLocation, Link } from 'react-router-dom'
import { CheckCircle, MapPin, Clock, IndianRupee, CalendarCheck } from 'lucide-react'
import { format } from 'date-fns'

export default function BookingConfirmPage() {
  const location = useLocation()
  const booking = location.state?.booking

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="font-fraunces text-2xl text-ink mb-4">No booking details found.</h1>
        <Link to="/venues" className="btn-primary">Browse Venues</Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      {/* Success animation */}
      <div className="w-20 h-20 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-teal" />
      </div>

      <h1 className="font-fraunces text-3xl font-bold text-ink mb-3">Booking Confirmed!</h1>
      <p className="text-muted mb-10">
        Your slot has been reserved. See you on the pitch!
      </p>

      {/* Booking summary card */}
      <div className="card text-left mb-8">
        <div className="text-xs text-muted uppercase tracking-wider font-medium mb-4">Booking #{booking.id}</div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-accent mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-ink">{booking.venueName}</p>
              <p className="text-xs text-muted">{booking.venueLocation}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={16} className="text-accent mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-ink">
                {format(new Date(booking.slotDate), 'EEEE, d MMMM yyyy')}
              </p>
              <p className="text-xs text-muted">{booking.slotStartTime} – {booking.slotEndTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-t border-border pt-4">
            <IndianRupee size={16} className="text-accent shrink-0" />
            <div className="flex-1 flex justify-between items-center">
              <span className="text-sm text-muted">Total paid</span>
              <span className="font-mono font-semibold text-accent text-lg">
                ₹{parseFloat(booking.amount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/my-bookings" className="btn-secondary flex items-center gap-2 justify-center">
          <CalendarCheck size={15} /> View My Bookings
        </Link>
        <Link to="/venues" className="btn-primary flex items-center gap-2 justify-center">
          Book Another Slot
        </Link>
      </div>
    </div>
  )
}
