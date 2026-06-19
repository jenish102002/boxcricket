import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { venueApi } from '../../api/venues'
import VenueCard from '../../components/venue/VenueCard'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { ArrowRight, CalendarCheck, MapPin, ShieldCheck, Search, Navigation } from 'lucide-react'
import { useState, useEffect } from 'react'

const steps = [
  { icon: MapPin, title: 'Choose a Venue', desc: 'Browse our curated selection of premium box cricket arenas.' },
  { icon: CalendarCheck, title: 'Pick Your Slot', desc: 'See live availability and select the perfect time slot.' },
  { icon: ShieldCheck, title: 'Confirm & Play', desc: 'Instant booking confirmation. Just show up and enjoy.' },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [location, setLocation] = useState({ lat: null, lng: null })
  const [isLocating, setIsLocating] = useState(false)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: venues, isLoading } = useQuery({
    queryKey: ['venues', debouncedSearch, location.lat, location.lng],
    queryFn: () => venueApi.getAll({ search: debouncedSearch, lat: location.lat, lng: location.lng }),
  })

  const handleDetectLocation = () => {
    setIsLocating(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
          setIsLocating(false)
        },
        (error) => {
          console.error(error)
          alert("Could not detect location. Please ensure location permissions are granted.")
          setIsLocating(false)
        }
      )
    } else {
      alert("Geolocation is not supported by your browser.")
      setIsLocating(false)
    }
  }

  const clearLocation = () => setLocation({ lat: null, lng: null })

  return (
    <div>
      {/* ── Hero Section ── */}
      <section className="relative bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-accent/30" />
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-pill px-3 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              <span className="text-white/80 text-xs font-medium">Now live across 4 cities</span>
            </div>
            <h1 className="font-fraunces text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Book your perfect<br />
              <em className="text-accent not-italic">box cricket</em> slot.
            </h1>
            <p className="text-white/60 text-lg mb-8 max-w-lg">
              Premium indoor venues, flexible time slots, instant confirmation. Play on your schedule.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#explore" className="btn-primary text-base px-8 py-4">
                Explore Venues <ArrowRight size={16} />
              </a>
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-pill font-medium hover:bg-white/10 transition-all duration-150">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-3">Book in 3 simple steps</h2>
            <p className="text-muted max-w-md mx-auto">From browsing to playing — under 2 minutes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-surface border border-border shadow-soft flex items-center justify-center mx-auto mb-5 relative">
                  <step.icon size={24} className="text-accent" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-fraunces text-lg font-semibold text-ink mb-2">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Venues ── */}
      <section id="explore" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="section-heading mb-2">Explore Venues</h2>
              <p className="text-muted">Find the perfect pitch near you.</p>
            </div>
            
            {/* Search & Location Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search by name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-9 py-2 w-full text-sm"
                />
              </div>
              
              <button 
                onClick={location.lat ? clearLocation : handleDetectLocation}
                disabled={isLocating}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-input text-sm font-medium border transition-colors w-full sm:w-auto ${
                  location.lat 
                    ? 'bg-accent/10 text-accent border-accent/20 hover:bg-danger/10 hover:text-danger hover:border-danger/20'
                    : 'bg-surface border-border text-ink hover:border-accent hover:text-accent'
                }`}
              >
                <Navigation size={16} className={isLocating ? 'animate-pulse' : ''} />
                {isLocating ? 'Locating...' : location.lat ? 'Clear GPS' : 'Find Nearest'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : venues?.length === 0 
                ? <div className="col-span-full py-12 text-center text-muted">No venues found matching your criteria.</div>
                : venues?.map(v => <VenueCard key={v.id} venue={v} />)
            }
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 bg-accent">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-fraunces text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to play?
          </h2>
          <p className="text-white/70 mb-8">Join thousands of cricketers booking smarter.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-accent rounded-pill font-semibold hover:shadow-hover hover:-translate-y-0.5 transition-all duration-150">
            Get Started Free <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
