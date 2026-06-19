import { useQuery } from '@tanstack/react-query'
import { venueApi } from '../../api/venues'
import VenueCard from '../../components/venue/VenueCard'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'

export default function VenuesPage() {
  const [search, setSearch] = useState('')

  const { data: venues, isLoading, error } = useQuery({
    queryKey: ['venues'],
    queryFn: venueApi.getAll,
  })

  const filtered = venues?.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="page-title mb-3">All Venues</h1>
        <p className="text-muted text-lg">Browse and book premium box cricket arenas near you.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-lg mb-10">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search venues or locations…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-10"
          aria-label="Search venues"
        />
      </div>

      {/* Grid */}
      {error && (
        <div className="text-center py-12 text-danger text-sm">Failed to load venues. Please refresh.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered?.map(v => <VenueCard key={v.id} venue={v} />)
        }
      </div>

      {!isLoading && filtered?.length === 0 && (
        <EmptyState
          icon={MapPin}
          title="No venues found"
          description={search ? `No venues match "${search}". Try a different search.` : 'No venues available right now.'}
        />
      )}
    </div>
  )
}
