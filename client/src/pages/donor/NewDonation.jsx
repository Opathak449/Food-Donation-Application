import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, Upload, X, MapPin } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { PageHeader } from '../../components/ui/index'

const CATEGORIES = ['Bakery', 'Cooked Meals', 'Produce', 'Non-Perishable', 'Dairy', 'Beverages', 'Other']
const UNITS = ['kg', 'lbs', 'portions', 'loaves', 'pieces', 'liters', 'cans', 'boxes', 'bags', 'whole cake', 'other']
const DELIVERY_MODES = [
  { value: 'pickup', label: '🚶 Pickup Only', desc: 'Recipient will collect from you' },
  { value: 'donor_delivery', label: '🚗 I Will Deliver', desc: 'You deliver to recipient' },
  { value: 'volunteer_delivery', label: '🚴 Volunteer Delivery', desc: 'A volunteer picks up & delivers' },
]

export default function NewDonation() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [form, setForm] = useState({
    title: '', category: '', quantity: '', unit: 'kg', description: '',
    cooked_at: '', expiry_at: '', is_perishable: 'true',
    delivery_mode: '', address: '', city: '', latitude: '', longitude: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB')
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.delivery_mode) return toast.error('Please select a delivery mode')
    if (!form.category) return toast.error('Please select a category')

    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
      if (imageFile) fd.append('image', imageFile)

      await api.post('/donations', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Donation posted successfully! 🎉')
      navigate('/donor/my-donations')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post donation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Post a Donation" subtitle="Share surplus food with those who need it most" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Food Photo</h3>
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
              <button type="button" onClick={() => { setImagePreview(null); setImageFile(null) }}
                className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100">
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
              <Upload size={28} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 font-medium">Click to upload a photo</p>
              <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          )}
        </motion.div>

        {/* Basic Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card space-y-4">
          <h3 className="font-semibold text-gray-800">Food Details</h3>
          <div>
            <label className="label">Food Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} className="input"
              placeholder="e.g. Fresh Sourdough Bread Loaves" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="select" required>
                <option value="">Select category</option>
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
            <div>
              <label className="label">Quantity *</label>
              <input type="number" step="0.1" min="0.1" value={form.quantity} onChange={e => set('quantity', e.target.value)}
                className="input" placeholder="e.g. 10" required />
            </div>
            <div>
              <label className="label">Unit *</label>
              <select value={form.unit} onChange={e => set('unit', e.target.value)} className="select">
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} className="input" rows={3}
              placeholder="Describe the food, dietary info, how it was prepared..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Prepared/Cooked At</label>
              <input type="datetime-local" value={form.cooked_at} onChange={e => set('cooked_at', e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Expiry Date/Time</label>
              <input type="datetime-local" value={form.expiry_at} onChange={e => set('expiry_at', e.target.value)} className="input" />
            </div>
          </div>
        </motion.div>

        {/* Delivery Mode */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Delivery Mode *</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DELIVERY_MODES.map(m => (
              <button key={m.value} type="button" onClick={() => set('delivery_mode', m.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${form.delivery_mode === m.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <p className="font-semibold text-gray-900 text-sm mb-1">{m.label}</p>
                <p className="text-xs text-gray-500">{m.desc}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Location */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2"><MapPin size={16} /> Pickup Location</h3>
          <div>
            <label className="label">Address *</label>
            <input value={form.address} onChange={e => set('address', e.target.value)} className="input"
              placeholder="123 Main Street" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">City *</label>
              <input value={form.city} onChange={e => set('city', e.target.value)} className="input" placeholder="New York" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Latitude (optional)</label>
              <input type="number" step="any" value={form.latitude} onChange={e => set('latitude', e.target.value)} className="input" placeholder="40.7128" />
            </div>
            <div>
              <label className="label">Longitude (optional)</label>
              <input type="number" step="any" value={form.longitude} onChange={e => set('longitude', e.target.value)} className="input" placeholder="-74.0060" />
            </div>
          </div>
        </motion.div>

        <div className="flex gap-4">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={18} className="animate-spin" /> Posting...</> : '🎉 Post Donation'}
          </button>
        </div>
      </form>
    </div>
  )
}
