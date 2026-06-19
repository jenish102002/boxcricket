import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { slotApi } from '../../api/slots'
import { format, addDays } from 'date-fns'
import { Skeleton } from '../ui/Skeleton'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

export default function SlotPicker({ venueId, onSlotSelect, selectedSlotId }) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const dateStr = format(selectedDate, 'yyyy-MM-dd')

  const { data: slots, isLoading, error } = useQuery({
    queryKey: ['slots', venueId, dateStr],
    queryFn: () => slotApi.getByVenue(venueId, dateStr),
    staleTime: 30_000,
  })

  // Generate 7-day calendar strip
  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i))

  return (
    <div>
      {/* Date strip */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2" role="group" aria-label="Select date">
        {days.map((day) => {
          const isSelected = format(day, 'yyyy-MM-dd') === dateStr
          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={clsx(
                'flex flex-col items-center px-4 py-3 rounded-input border shrink-0 transition-all duration-150 min-w-[64px]',
                isSelected
                  ? 'border-accent bg-accent text-white shadow-soft'
                  : 'border-border text-ink hover:border-accent/50 hover:bg-accent/5'
              )}
            >
              <span className="text-xs font-medium opacity-80 uppercase">{format(day, 'EEE')}</span>
              <span className="text-lg font-mono font-semibold leading-tight">{format(day, 'd')}</span>
            </button>
          )
        })}
      </div>

      {/* Slot grid */}
      <div>
        <p className="text-sm text-muted mb-3">
          Available slots for <strong className="text-ink">{format(selectedDate, 'EEEE, d MMMM yyyy')}</strong>
        </p>

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-danger text-sm">Failed to load slots. Please try again.</p>
        )}

        {!isLoading && !error && slots?.length === 0 && (
          <div className="text-center py-12 text-muted">
            <p className="font-fraunces text-xl mb-1">No slots available</p>
            <p className="text-sm">Try a different date.</p>
          </div>
        )}

        {!isLoading && !error && slots?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2" role="group" aria-label="Available time slots">
            {slots.map((slot) => {
              const isSelected = selectedSlotId === slot.id
              const isAvailable = slot.status === 'AVAILABLE' && slot.bookedCount < slot.capacity
              const isBooked = slot.status === 'BOOKED' || (!isAvailable && slot.status !== 'BLOCKED')
              const isBlocked = slot.status === 'BLOCKED'

              return (
                <button
                  key={slot.id}
                  disabled={!isAvailable}
                  onClick={() => isAvailable && onSlotSelect(isSelected ? null : slot)}
                  aria-pressed={isSelected}
                  aria-disabled={!isAvailable}
                  className={clsx(
                    'slot-chip',
                    isSelected && 'slot-chip-selected',
                    isAvailable && !isSelected && 'slot-chip-available',
                    (isBooked || isBlocked) && 'slot-chip-booked'
                  )}
                >
                  <span className="block text-xs font-medium">
                    {slot.startTime} – {slot.endTime}
                  </span>
                  <span className={clsx('block text-xs mt-0.5', isSelected ? 'text-white/80' : 'text-muted')}>
                    {isBlocked ? 'Blocked' : isBooked ? 'Full' : 'Available'}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
