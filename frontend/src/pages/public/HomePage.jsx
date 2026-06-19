import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { venueApi } from '../../api/venues'
import VenueCard from '../../components/venue/VenueCard'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { ArrowRight, CalendarCheck, MapPin, ShieldCheck } from 'lucide-react'

const steps = [
  { icon: MapPin, title: 'Choose a Venue', desc: 'Browse our curated selection of premium box cricket arenas.' },
  { icon: CalendarCheck, title: 'Pick Your Slot', desc: 'See live availability and select the perfect time slot.' },
  { icon: ShieldCheck, title: 'Confirm & Play', desc: 'Instant booking confirmation. Just show up and enjoy.' },
]

export default function HomePage() {
  const { data: venues, isLoading } = useQuery({
    queryKey: ['venues'],
    queryFn: venueApi.getAll,
  })

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
              <Link to="/venues" className="btn-primary text-base px-8 py-4">
                Browse Venues <ArrowRight size={16} />
              </Link>
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-heading mb-2">Featured venues</h2>
              <p className="text-muted">Hand-picked, premium box cricket arenas.</p>
            </div>
            <Link to="/venues" className="btn-ghost hidden sm:flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : venues?.slice(0, 4).map(v => <VenueCard key={v.id} venue={v} />)
            }
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link to="/venues" className="btn-secondary">View all venues</Link>
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
