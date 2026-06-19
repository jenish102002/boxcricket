import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { slotApi } from '../../api/slots'
import { venueApi } from '../../api/venues'
import { useToast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, Clock, Layers } from 'lucide-react'
import { format } from 'date-fns'

const singleSchema = z.object({
  venueId: z.string().min(1, 'Select a venue'),
  date: z.string().min(1, 'Select a date'),
  startTime: z.string().min(1, 'Start time required'),
  endTime: z.string().min(1, 'End time required'),
  capacity: z.string().default('1'),
})

const bulkSchema = z.object({
  venueId: z.string().min(1, 'Select a venue'),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().min(1, 'End date required'),
  dayStartTime: z.string().min(1, 'Day start time required'),
  dayEndTime: z.string().min(1, 'Day end time required'),
  slotDurationHours: z.string().default('1'),
  capacity: z.string().default('1'),
})

export default function AdminSlotsPage() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [singleModalOpen, setSingleModalOpen] = useState(false)
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [filterVenueId, setFilterVenueId] = useState('')

  const { data: slots, isLoading } = useQuery({
    queryKey: ['admin-slots'],
    queryFn: slotApi.getAll,
  })

  const { data: venues } = useQuery({
    queryKey: ['admin-venues'],
    queryFn: venueApi.getAllAdmin,
  })

  const filteredSlots = filterVenueId
    ? slots?.filter(s => String(s.venueId) === filterVenueId)
    : slots

  const { register: regSingle, handleSubmit: handleSingle, formState: { errors: errSingle }, reset: resetSingle } = useForm({ resolver: zodResolver(singleSchema), defaultValues: { capacity: '1' } })
  const { register: regBulk, handleSubmit: handleBulk, formState: { errors: errBulk }, reset: resetBulk } = useForm({ resolver: zodResolver(bulkSchema), defaultValues: { slotDurationHours: '1', capacity: '1' } })

  const createMutation = useMutation({
    mutationFn: slotApi.create,
    onSuccess: (data) => {
      toast('Slot created', 'success')
      queryClient.invalidateQueries(['admin-slots'])
      setSingleModalOpen(false)
      resetSingle()
    },
    onError: (e) => toast(e?.response?.data?.message || 'Failed to create slot', 'error'),
  })

  const bulkMutation = useMutation({
    mutationFn: slotApi.bulkCreate,
    onSuccess: (data) => {
      toast(`${data.length} slots generated`, 'success')
      queryClient.invalidateQueries(['admin-slots'])
      setBulkModalOpen(false)
      resetBulk()
    },
    onError: (e) => toast(e?.response?.data?.message || 'Bulk generation failed', 'error'),
  })

  const deleteMutation = useMutation({
    mutationFn: slotApi.delete,
    onSuccess: () => {
      toast('Slot deleted', 'success')
      queryClient.invalidateQueries(['admin-slots'])
      setDeleteTarget(null)
    },
    onError: (e) => toast(e?.response?.data?.message || 'Delete failed', 'error'),
  })

  const onSingleSubmit = (d) => createMutation.mutate({
    venueId: parseInt(d.venueId),
    date: d.date,
    startTime: d.startTime,
    endTime: d.endTime,
    capacity: parseInt(d.capacity),
  })

  const onBulkSubmit = (d) => bulkMutation.mutate({
    venueId: parseInt(d.venueId),
    startDate: d.startDate,
    endDate: d.endDate,
    dayStartTime: d.dayStartTime,
    dayEndTime: d.dayEndTime,
    slotDurationHours: parseInt(d.slotDurationHours),
    capacity: parseInt(d.capacity),
  })

  const VenueSelect = ({ reg, err }) => (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">Venue</label>
      <select className="input-field" {...reg('venueId')}>
        <option value="">Select venue…</option>
        {venues?.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
      </select>
      {err?.venueId && <p className="text-danger text-xs mt-1">{err.venueId.message}</p>}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-fraunces text-3xl font-bold text-ink mb-1">Slots</h1>
          <p className="text-muted text-sm">Manage all time slots across venues.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setBulkModalOpen(true)} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
            <Layers size={14} /> Bulk Generate
          </button>
          <button onClick={() => setSingleModalOpen(true)} className="btn-primary text-sm">
            <Plus size={14} /> Add Slot
          </button>
        </div>
      </div>

      {/* Filter by venue */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted font-medium shrink-0">Filter by venue:</label>
        <select
          value={filterVenueId}
          onChange={e => setFilterVenueId(e.target.value)}
          className="input-field max-w-xs py-2 text-sm"
        >
          <option value="">All venues</option>
          {venues?.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
      ) : filteredSlots?.length === 0 ? (
        <EmptyState icon={Clock} title="No slots" description="Generate or create slots to get started." />
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Venue</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Capacity</th>
                  <th>Booked</th>
                  <th>Status</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredSlots?.slice(0, 100).map(s => (
                  <tr key={s.id}>
                    <td className="font-mono text-muted text-xs">#{s.id}</td>
                    <td className="font-medium text-ink">{s.venueName}</td>
                    <td className="font-mono text-sm">{format(new Date(s.date), 'd MMM yyyy')}</td>
                    <td className="font-mono text-sm whitespace-nowrap">{s.startTime}–{s.endTime}</td>
                    <td className="font-mono text-sm">{s.capacity}</td>
                    <td className="font-mono text-sm">{s.bookedCount}</td>
                    <td><Badge status={s.status} /></td>
                    <td>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="p-1.5 text-muted hover:text-danger rounded-input hover:bg-danger/5 transition-colors"
                        aria-label="Delete slot"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSlots?.length > 100 && (
              <p className="text-center text-xs text-muted py-3">Showing first 100 of {filteredSlots.length} slots</p>
            )}
          </div>
        </div>
      )}

      {/* Single slot modal */}
      <Modal isOpen={singleModalOpen} onClose={() => setSingleModalOpen(false)} title="New Slot">
        <form onSubmit={handleSingle(onSingleSubmit)} className="space-y-4">
          <VenueSelect reg={regSingle} err={errSingle} />
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Date</label>
            <input type="date" className="input-field" {...regSingle('date')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Start Time</label>
              <input type="time" className="input-field" {...regSingle('startTime')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">End Time</label>
              <input type="time" className="input-field" {...regSingle('endTime')} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Capacity</label>
            <input type="number" min="1" className="input-field" {...regSingle('capacity')} />
          </div>
          <button type="submit" className="btn-primary w-full justify-center" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating…' : 'Create Slot'}
          </button>
        </form>
      </Modal>

      {/* Bulk generate modal */}
      <Modal isOpen={bulkModalOpen} onClose={() => setBulkModalOpen(false)} title="Bulk Generate Slots">
        <form onSubmit={handleBulk(onBulkSubmit)} className="space-y-4">
          <VenueSelect reg={regBulk} err={errBulk} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Start Date</label>
              <input type="date" className="input-field" {...regBulk('startDate')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">End Date</label>
              <input type="date" className="input-field" {...regBulk('endDate')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Day Start</label>
              <input type="time" className="input-field" defaultValue="09:00" {...regBulk('dayStartTime')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Day End</label>
              <input type="time" className="input-field" defaultValue="21:00" {...regBulk('dayEndTime')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Duration (hours)</label>
              <input type="number" min="1" max="4" className="input-field" {...regBulk('slotDurationHours')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Capacity per Slot</label>
              <input type="number" min="1" className="input-field" {...regBulk('capacity')} />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full justify-center" disabled={bulkMutation.isPending}>
            {bulkMutation.isPending ? 'Generating…' : 'Generate Slots'}
          </button>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Slot" size="sm">
        <p className="text-ink mb-6">Delete slot on {deleteTarget && format(new Date(deleteTarget.date), 'd MMM')} at {deleteTarget?.startTime}? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={() => deleteMutation.mutate(deleteTarget.id)} disabled={deleteMutation.isPending} className="btn-danger flex-1 justify-center">
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
