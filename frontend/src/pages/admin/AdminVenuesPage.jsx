import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { venueApi } from '../../api/venues'
import { useToast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  description: z.string().optional(),
  location: z.string().min(2, 'Location required'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  pricePerSlot: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid price'),
  active: z.boolean().default(true),
})

function VenueForm({ onSubmit, defaultValues, isPending }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ? {
      ...defaultValues,
      pricePerSlot: String(defaultValues.pricePerSlot),
    } : { active: true },
  })

  const imageUrlValue = watch('imageUrl')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Venue Name</label>
        <input className="input-field" {...register('name')} />
        {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Location</label>
        <input className="input-field" {...register('location')} />
        {errors.location && <p className="text-danger text-xs mt-1">{errors.location.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Description</label>
        <textarea rows={3} className="input-field resize-none" {...register('description')} />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Venue Photo</label>
        <div className="flex items-center gap-4">
          {imageUrlValue ? (
             <img src={imageUrlValue} alt="Preview" className="w-16 h-16 rounded-input object-cover shrink-0 border border-line" />
          ) : (
             <div className="w-16 h-16 rounded-input bg-surface-alt flex items-center justify-center text-muted border border-line text-xs font-medium">None</div>
          )}
          <div className="flex-1">
             <input type="file" accept="image/*" className="input-field py-2 text-sm" onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                   const reader = new FileReader()
                   reader.onloadend = () => setValue('imageUrl', reader.result)
                   reader.readAsDataURL(file)
                }
             }} />
          </div>
        </div>
        {errors.imageUrl && <p className="text-danger text-xs mt-1">{errors.imageUrl.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Price per Slot (₹)</label>
        <input type="number" step="0.01" className="input-field" {...register('pricePerSlot')} />
        {errors.pricePerSlot && <p className="text-danger text-xs mt-1">{errors.pricePerSlot.message}</p>}
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="active" className="w-4 h-4 accent-accent" {...register('active')} />
        <label htmlFor="active" className="text-sm font-medium text-ink">Active (visible to users)</label>
      </div>
      <button type="submit" disabled={isPending} className="btn-primary w-full justify-center">
        {isPending ? 'Saving…' : 'Save Venue'}
      </button>
    </form>
  )
}

export default function AdminVenuesPage() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editVenue, setEditVenue] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data: venues, isLoading } = useQuery({
    queryKey: ['admin-venues'],
    queryFn: venueApi.getAllAdmin,
  })

  const createMutation = useMutation({
    mutationFn: venueApi.create,
    onSuccess: () => {
      toast('Venue created', 'success')
      queryClient.invalidateQueries(['admin-venues'])
      queryClient.invalidateQueries(['venues'])
      setModalOpen(false)
    },
    onError: (e) => toast(e?.response?.data?.message || 'Failed to create venue', 'error'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => venueApi.update(id, data),
    onSuccess: () => {
      toast('Venue updated', 'success')
      queryClient.invalidateQueries(['admin-venues'])
      queryClient.invalidateQueries(['venues'])
      setEditVenue(null)
    },
    onError: (e) => toast(e?.response?.data?.message || 'Failed to update venue', 'error'),
  })

  const deleteMutation = useMutation({
    mutationFn: venueApi.delete,
    onSuccess: () => {
      toast('Venue deleted', 'success')
      queryClient.invalidateQueries(['admin-venues'])
      queryClient.invalidateQueries(['venues'])
      setDeleteTarget(null)
    },
    onError: (e) => toast(e?.response?.data?.message || 'Failed to delete venue', 'error'),
  })

  const handleCreate = (data) => createMutation.mutate({ ...data, pricePerSlot: parseFloat(data.pricePerSlot) })
  const handleUpdate = (data) => updateMutation.mutate({ id: editVenue.id, data: { ...data, pricePerSlot: parseFloat(data.pricePerSlot) } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-fraunces text-3xl font-bold text-ink mb-1">Venues</h1>
          <p className="text-muted text-sm">Manage all box cricket venues.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Add Venue
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : venues?.length === 0 ? (
        <EmptyState icon={Building2} title="No venues yet" description="Create your first venue." />
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Venue</th>
                <th>Location</th>
                <th>Price / Slot</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {venues.map(v => (
                <tr key={v.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {v.imageUrl ? (
                        <img src={v.imageUrl} alt={v.name} className="w-10 h-10 rounded-input object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-input bg-surface-alt flex items-center justify-center text-muted text-xs font-bold">
                          {v.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium text-ink">{v.name}</span>
                    </div>
                  </td>
                  <td className="text-muted">{v.location}</td>
                  <td className="font-mono">₹{parseFloat(v.pricePerSlot).toLocaleString('en-IN')}</td>
                  <td><Badge status={v.active ? 'AVAILABLE' : 'BLOCKED'} /></td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditVenue(v)}
                        className="p-1.5 text-muted hover:text-ink rounded-input hover:bg-surface-alt transition-colors"
                        aria-label="Edit venue"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(v)}
                        className="p-1.5 text-muted hover:text-danger rounded-input hover:bg-danger/5 transition-colors"
                        aria-label="Delete venue"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Venue">
        <VenueForm onSubmit={handleCreate} isPending={createMutation.isPending} />
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={!!editVenue} onClose={() => setEditVenue(null)} title="Edit Venue">
        {editVenue && <VenueForm onSubmit={handleUpdate} defaultValues={editVenue} isPending={updateMutation.isPending} />}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Venue" size="sm">
        <p className="text-ink mb-6">Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button
            onClick={() => deleteMutation.mutate(deleteTarget.id)}
            disabled={deleteMutation.isPending}
            className="btn-danger flex-1 justify-center"
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
