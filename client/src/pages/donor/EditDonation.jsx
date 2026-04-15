import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2, Upload, X } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { PageHeader, Skeleton } from '../../components/ui/index'

const CATEGORIES = ['Bakery', 'Cooked Meals', 'Produce', 'Non-Perishable', 'Dairy', 'Beverages', 'Other']
const UNITS = ['kg', 'lbs', 'portions', 'loaves', 'pieces', 'liters', 'cans', 'boxes', 'bags', 'whole cake', 'other']
const DELIVERY_MODES = [
  { value: 'pickup', label: '🚶 Pickup Only' },
  { value: 'donor_delivery', label: '🚗 I Will Deliver' },
  { value: 'volunteer_delivery', label: '🚴 Volunteer Delivery' },
]

export default function EditDonation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [form, setForm] = useState(null)

  useEffect(() => {
    api.get(`/donations/${id}`).then(res => {
      const d = res.data.data
      const fmt = (s) => s ? new Date(s).toISOString().slice(0, 16) : ''
      setForm({
        title: d.title, category: d.category, quantity: d.quantity, unit: d.unit,
        description: d.description || '', cooked_at: fmt(d.cooked_at), expiry_at: fmt(d.expiry_at),
        is_perishable: String(d.is_perishable === 1 || d.is_perishable === true),
        delivery_mode: d.delivery_mode, address: d.address, city: d.city,
        latitude: d.latitude || '', longitude: d.longitude || '',
      })
      if (d.image_url) setImagePreview(d.image_url)
    }).catch(() => toast.error('Donation not found')).finally(() => setFetching(false))
  }, [id])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v) })
      if (imageFile) fd.append('image', imageFile)
      await api.put(`/donations/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Donation updated!')
      navigate('/donor/my-donations')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update donation')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="space-y-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
  if (!form) return <p className="text-gray-500">Donation not found</p>

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Edit Donation" subtitle="Update your donation details" />
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Food Photo</h3>
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
              <button type="button" onClick={() => { setImagePreview(null); setImageFile(null) }}
                className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100"><X size={16} /></button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
              <Upload size={28} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload</p>
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          )}
        </div>

        {/* Details */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-800">Food Details</h3>
          <div>
            <label className="label">Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} className="input" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="select">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Perishable?</label>
              <select value={form.is_perishable} onChange={e => set('is_perishable', e.target.value)} className="select">
                <option value="true">Yes, Perishable</option>
                <option value="false">No, Non-Perishable</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Quantity</label><input type="number" step="0.1" value={form.quantity} onChange={e => set('quantity', e.target.value)} className="input" /></div>
            <div><label className="label">Unit</label><select value={form.unit} onChange={e => set('unit', e.target.value)} className="select">{UNITS.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
          </div>
          <div><label className="label">Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} className="input" rows={3} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Prepared At</label><input type="datetime-local" value={form.cooked_at} onChange={e => set('cooked_at', e.target.value)} className="input" /></div>
            <div><label className="label">Expires At</label><input type="datetime-local" value={form.expiry_at} onChange={e => set('expiry_at', e.target.value)} className="input" /></div>
          </div>
        </div>

        {/* Delivery mode */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3">Delivery Mode</h3>
          <div className="grid grid-cols-3 gap-3">
            {DELIVERY_MODES.map(m => (
              <button key={m.value} type="button" onClick={() => set('delivery_mode', m.value)}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${form.delivery_mode === m.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-800">Location</h3>
          <div><label className="label">Address</label><input value={form.address} onChange={e => set('address', e.target.value)} className="input" /></div>
          <div><label className="label">City</label><input value={form.city} onChange={e => set('city', e.target.value)} className="input" /></div>
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
