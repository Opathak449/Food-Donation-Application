import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../features/auth/AuthContext'
import toast from 'react-hot-toast'

const roles = [
  { value: 'donor', label: 'Donor', emoji: '🤝', desc: 'I have food to donate' },
  { value: 'recipient', label: 'Recipient', emoji: '🙏', desc: 'I need food support' },
  { value: 'volunteer', label: 'Volunteer', emoji: '🚴', desc: 'I want to help deliver' },
]

const roleMap = { donor: '/donor/dashboard', recipient: '/recipient/dashboard', volunteer: '/volunteer/dashboard' }

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', phone: '', role: '', city: '', address: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.role) return toast.error('Please select a role.')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.')
    setLoading(true)
    try {
      const user = await register(form)
      toast.success('Welcome to FoodShare! 🎉')
      navigate(roleMap[user.role] || '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-500 to-accent-700 text-white flex-col justify-center p-16">
        <Heart size={48} className="fill-white mb-8" />
        <h2 className="font-display text-4xl font-bold mb-4">Join the Movement</h2>
        <p className="text-accent-100 text-lg leading-relaxed">Whether you're donating, receiving, or volunteering — every role matters in building a hunger-free community.</p>
      </div>

      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-8 lg:px-16 overflow-y-auto">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <Heart size={18} className="text-white fill-white" />
            </div>
            <span className="font-display font-bold text-xl">Food<span className="text-primary-600">Share</span></span>
          </div>

          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Create account</h1>
          <p className="text-gray-500 mb-6">Already have one? <Link to="/login" className="text-primary-600 hover:underline font-medium">Sign in</Link></p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selection */}
            <div>
              <label className="label">I am a...</label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map(r => (
                  <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${form.role === r.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="text-2xl mb-1">{r.emoji}</div>
                    <p className="text-xs font-semibold text-gray-800">{r.label}</p>
                    <p className="text-xs text-gray-500 leading-tight mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="label">Full Name</label>
                <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })}
                  className="input" placeholder="John Doe" required />
              </div>
              <div className="col-span-2">
                <label className="label">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input" placeholder="you@example.com" required />
              </div>
              <div>
                <label className="label">Phone</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="input" placeholder="+1 555 0100" />
              </div>
              <div>
                <label className="label">City</label>
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                  className="input" placeholder="New York" />
              </div>
              <div className="col-span-2">
                <label className="label">Address</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  className="input" placeholder="123 Main Street" />
              </div>
              <div className="col-span-2">
                <label className="label">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    className="input pr-10" placeholder="Min. 6 characters" required minLength={6} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
