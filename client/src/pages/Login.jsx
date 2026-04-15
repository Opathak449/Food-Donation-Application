import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../features/auth/AuthContext'
import toast from 'react-hot-toast'

const roleMap = { donor: '/donor/dashboard', recipient: '/recipient/dashboard', volunteer: '/volunteer/dashboard', admin: '/admin/dashboard' }

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.full_name.split(' ')[0]}!`)
      navigate(roleMap[user.role] || '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const demoLogins = [
    { label: 'Admin', email: 'admin@foodshare.org', color: 'bg-red-100 text-red-700' },
    { label: 'Donor', email: 'sarah@donor.com', color: 'bg-primary-100 text-primary-700' },
    { label: 'Recipient', email: 'marcus@recipient.com', color: 'bg-blue-100 text-blue-700' },
    { label: 'Volunteer', email: 'jenny@volunteer.com', color: 'bg-purple-100 text-purple-700' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 text-white flex-col justify-center p-16">
        <Heart size={48} className="fill-white mb-8" />
        <h2 className="font-display text-4xl font-bold mb-4">Welcome back to FoodShare</h2>
        <p className="text-primary-200 text-lg leading-relaxed mb-8">Every time you log in, you're one step closer to reducing waste and feeding someone in need.</p>
        <div className="space-y-4">
          {['10,000+ meals donated', '500+ active volunteers', '2,400+ families helped'].map(t => (
            <div key={t} className="flex items-center gap-3 text-primary-100">
              <div className="w-2 h-2 bg-primary-300 rounded-full" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-8 lg:px-16">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <Heart size={18} className="text-white fill-white" />
            </div>
            <span className="font-display font-bold text-xl">Food<span className="text-primary-600">Share</span></span>
          </div>

          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Sign in</h1>
          <p className="text-gray-500 mb-8">Don't have an account? <Link to="/register" className="text-primary-600 hover:underline font-medium">Register here</Link></p>

          {/* Demo logins */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 font-medium mb-3">Demo accounts (password: <code className="bg-gray-200 px-1 rounded">password123</code>)</p>
            <div className="flex flex-wrap gap-2">
              {demoLogins.map(d => (
                <button key={d.label} onClick={() => setForm({ email: d.email, password: 'password123' })}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${d.color} hover:opacity-80 transition-opacity`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="input" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
