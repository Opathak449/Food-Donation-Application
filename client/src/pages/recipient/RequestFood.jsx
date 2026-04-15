import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { PageHeader } from '../../components/ui/index'

const CATEGORIES = ['Bakery', 'Cooked Meals', 'Produce', 'Non-Perishable', 'Dairy', 'Beverages', 'Other']
const URGENCY = [
  { value: 'low', label: '🟢 Low', desc: 'Needed in a week or more' },
  { value: 'medium', label: '🟡 Medium', desc: 'Needed in a few days' },
  { value: 'high', label: '🟠 High', desc: 'Needed today or tomorrow' },
  { value: 'critical', label: '🔴 Critical', desc: 'Urgent — needed immediately' },
]

export default function RequestFood() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', category: '', quantity_needed: '', description: '',
    urgency_level: 'medium', address: '', city: '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.category) return toast.error('Please select a category')
    setLoading(true)
    try {
      await api.post('/requests', form)
      toast.success('Food request submitted! Donors will be notified.')
      navigate('/recipient/my-requests')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <PageHeader title="Request Food" subtitle="Let donors know what food you need" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-800">What do you need?</h3>
          <div>
            <label className="label">Request Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} className="input"
              placeholder="e.g. Meals for 10 families tonight" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="select" required>
                <option value="">Select...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Quantity Needed</label>
              <input type="number" step="0.1" value={form.quantity_needed} onChange={e => set('quantity_needed', e.target.value)}
                className="input" placeholder="e.g. 20 portions" required />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              className="input" rows={3} placeholder="Tell donors more about your situation and needs..." />
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Urgency Level *</h3>
          <div className="grid grid-cols-2 gap-3">
            {URGENCY.map(u => (
              <button key={u.value} type="button" onClick={() => set('urgency_level', u.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${form.urgency_level === u.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <p className="font-semibold text-sm text-gray-900">{u.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{u.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="font-semibold text-gray-800">Your Location</h3>
          <div>
            <label className="label">Address</label>
            <input value={form.address} onChange={e => set('address', e.target.value)} className="input" placeholder="123 Main St" />
          </div>
          <div>
            <label className="label">City</label>
            <input value={form.city} onChange={e => set('city', e.target.value)} className="input" placeholder="New York" />
          </div>
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : '📋 Submit Request'}
          </button>
        </div>
      </form>
    </div>
  )
}
