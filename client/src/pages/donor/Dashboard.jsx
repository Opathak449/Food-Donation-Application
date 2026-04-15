import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, CheckCircle, Clock, PlusCircle, TrendingUp, Users, AlertCircle } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../features/auth/AuthContext'
import { KpiCard, StatusBadge, CategoryBadge, Skeleton, EmptyState, PageHeader } from '../../components/ui/index'

export default function DonorDashboard() {
  const { user } = useAuth()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/donations/my')
      .then(res => setDonations(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: donations.length,
    available: donations.filter(d => d.status === 'available').length,
    completed: donations.filter(d => d.status === 'completed').length,
    claimed: donations.filter(d => ['claimed', 'assigned', 'in_transit'].includes(d.status)).length,
  }

  const recent = donations.slice(0, 5)

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.full_name?.split(' ')[0]}! 👋`}
        subtitle="Here's an overview of your food donations"
        action={<Link to="/donor/new-donation" className="btn-primary flex items-center gap-2"><PlusCircle size={18} /> New Donation</Link>}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Total Donated" value={stats.total} icon={Package} color="primary" />
        <KpiCard title="Available" value={stats.available} icon={TrendingUp} color="accent" />
        <KpiCard title="In Progress" value={stats.claimed} icon={Clock} color="blue" />
        <KpiCard title="Completed" value={stats.completed} icon={CheckCircle} color="gray" />
      </div>

      {/* Impact message */}
      {stats.completed > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-6 text-white mb-8 flex items-center gap-4">
          <div className="text-5xl">🌟</div>
          <div>
            <h3 className="font-display text-xl font-bold">Amazing Impact!</h3>
            <p className="text-primary-100">You've completed {stats.completed} donation{stats.completed > 1 ? 's' : ''} — that's real meals reaching real people. Thank you!</p>
          </div>
        </motion.div>
      )}

      {/* Recent Donations */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-lg text-gray-900">Recent Donations</h2>
          <Link to="/donor/my-donations" className="text-sm text-primary-600 hover:underline font-medium">View all →</Link>
        </div>

        {loading ? (
          <div className="space-y-3">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : recent.length === 0 ? (
          <EmptyState icon={Package} title="No donations yet"
            description="Start making a difference by posting your first food donation."
            action={<Link to="/donor/new-donation" className="btn-primary">Post Donation</Link>} />
        ) : (
          <div className="space-y-3">
            {recent.map(d => (
              <Link to={`/donations/${d.id}`} key={d.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center text-2xl flex-shrink-0">
                  {d.image_url ? <img src={d.image_url} alt={d.title} className="w-full h-full rounded-xl object-cover" /> : '🍽️'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">{d.title}</p>
                  <p className="text-sm text-gray-500">{d.quantity} {d.unit} · {d.city}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <CategoryBadge category={d.category} />
                  <StatusBadge status={d.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick tips */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: '📸', title: 'Add photos', desc: 'Donations with photos get claimed 3x faster.' },
          { icon: '⏰', title: 'Set expiry times', desc: 'Help recipients know when to pick up food.' },
          { icon: '📍', title: 'Be specific', desc: 'Clear addresses speed up pickup and delivery.' },
        ].map(tip => (
          <div key={tip.title} className="card bg-gray-50 border border-gray-100">
            <div className="text-3xl mb-2">{tip.icon}</div>
            <p className="font-semibold text-gray-800 text-sm">{tip.title}</p>
            <p className="text-xs text-gray-500 mt-1">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
