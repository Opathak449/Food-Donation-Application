import { useState } from 'react'
import { Loader2, User } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../features/auth/AuthContext'
import toast from 'react-hot-toast'
import { PageHeader } from '../components/ui/index'

const roleColors = { donor: 'bg-primary-100 text-primary-700', recipient: 'bg-blue-100 text-blue-700', volunteer: 'bg-purple-100 text-purple-700', admin: 'bg-red-100 text-red-700' }

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.put('/auth/profile', form)
      updateUser(res.data.user)
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update profile') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto">
      <PageHeader title="My Profile" subtitle="Manage your account information" />
      <div className="card mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
          {user?.full_name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-gray-900">{user?.full_name}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <span className={`badge capitalize mt-1 ${roleColors[user?.role]}`}>{user?.role}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <h3 className="font-semibold text-gray-800">Edit Information</h3>
        <div>
          <label className="label">Full Name</label>
          <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className="input" required />
        </div>
        <div>
          <label className="label">Phone</label>
          <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input" placeholder="+1 555 0000" />
        </div>
        <div>
          <label className="label">City</label>
          <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="input" placeholder="New York" />
        </div>
        <div>
          <label className="label">Address</label>
          <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="input" placeholder="123 Main St" />
        </div>
        <div className="pt-2">
          <label className="label">Email (cannot be changed)</label>
          <input value={user?.email} disabled className="input bg-gray-50 text-gray-400 cursor-not-allowed" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
