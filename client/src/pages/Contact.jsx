import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/contact', form)
      toast.success('Message sent! We\'ll get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-5xl mb-4">✉️</div>
            <h1 className="font-display text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-primary-100 text-xl">Have a question, partnership idea, or need support? We'd love to hear from you.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Info */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Contact Info</h2>
              {[
                { icon: Mail, label: 'Email', value: 'hello@foodshare.org', color: 'bg-primary-100 text-primary-600' },
                { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', color: 'bg-accent-100 text-accent-600' },
                { icon: MapPin, label: 'Headquarters', value: '123 Community Ave, New York, NY 10001', color: 'bg-blue-100 text-blue-600' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.label}</p>
                    <p className="text-gray-800 font-medium text-sm mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="bg-primary-50 rounded-xl p-5 border border-primary-100">
              <h3 className="font-semibold text-primary-800 mb-2">🤝 NGO Partnerships</h3>
              <p className="text-sm text-primary-700 leading-relaxed">Are you an NGO or community organization looking to partner with FoodShare? We'd love to collaborate to extend our reach and impact.</p>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8 space-y-5">
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Your Name</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} className="input" placeholder="John Doe" required />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input" placeholder="you@example.com" required />
                </div>
              </div>
              <div>
                <label className="label">Subject</label>
                <input value={form.subject} onChange={e => set('subject', e.target.value)} className="input" placeholder="How can we help?" required />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea value={form.message} onChange={e => set('message', e.target.value)} className="input" rows={6}
                  placeholder="Tell us more about your question or inquiry..." required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
