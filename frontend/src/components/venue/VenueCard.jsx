import { Link } from 'react-router-dom'
import { MapPin, IndianRupee } from 'lucide-react'

export default function VenueCard({ venue }) {
  return (
    <div className="group bg-surface border border-border rounded-card shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-200 overflow-hidden">
      {/* Image header */}
      <div className="relative h-48 overflow-hidden bg-surface-alt">
        {venue.imageUrl ? (
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <span className="font-fraunces text-3xl">{venue.name.charAt(0)}</span>
          </div>
        )}
        {!venue.active && (
          <div className="absolute top-3 right-3 bg-danger/90 text-white text-xs font-medium px-2 py-1 rounded-full">
            Inactive
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-fraunces text-lg font-semibold text-ink mb-1 leading-snug">{venue.name}</h3>
        <div className="flex items-center gap-1 text-muted text-sm mb-3">
          <MapPin size={13} className="shrink-0" />
          <span className="truncate">{venue.location}</span>
          {venue.distanceKm !== undefined && venue.distanceKm !== null && (
            <>
              <span className="mx-1 text-border">•</span>
              <span className="font-medium text-accent whitespace-nowrap">{venue.distanceKm} km away</span>
            </>
          )}
        </div>
        {venue.description && (
          <p className="text-muted text-sm line-clamp-2 mb-4">{venue.description}</p>
        )}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1 text-ink">
            <IndianRupee size={15} className="text-accent" />
            <span className="font-mono text-lg font-semibold text-accent">
              {parseFloat(venue.pricePerSlot).toLocaleString('en-IN')}
            </span>
            <span className="text-muted text-xs">/slot</span>
          </div>
          <Link
            to={`/venues/${venue.id}`}
            className="btn-primary text-sm px-4 py-2"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}
