import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, CheckSquare, ClipboardList, Search, Clock, Heart } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../features/auth/AuthContext'
import { KpiCard, StatusBadge, DonationCard, EmptyState, Skeleton, PageHeader } from '../../components/ui/index'
import { useNavigate } from 'react-router-dom'

export default function RecipientDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [claims, setClaims] = useState([])
  const [available, setAvailable] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/donations/claims'),
      api.get('/donations', { params: { status: 'available' } }),
      api.get('/requests/my'),
    ]).then(([claimsRes, avRes, reqRes]) => {
      setClaims(claimsRes.data.data)
      setAvailable(avRes.data.data.slice(0, 4))
      setRequests(reqRes.data.data)
    }).finally(() => setLoading(false))
  }, [])

  const active = claims.filter(c => !['completed', 'cancelled', 'expired'].includes(c.status))
  const completed = claims.filter(c => c.status === 'completed')

  return (
    <div>
      <PageHeader title={`Hi, ${user?.full_name?.split(' ')[0]}! 🙏`} subtitle="Browse available food and track your claims" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Active Claims" value={active.length} icon={Clock} color="accent" />
        <KpiCard title="Completed" value={completed.length} icon={CheckSquare} color="primary" />
        <KpiCard title="My Requests" value={requests.length} icon={ClipboardList} color="blue" />
        <KpiCard title="Food Near You" value={available.length} icon={Package} color="purple" />
      </div>

      {/* Active claims */}
      {active.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg">Active Claims</h2>
            <Link to="/recipient/my-claims" className="text-sm text-primary-600 hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {active.slice(0, 3).map(c => (
              <div key={c.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">
                  {c.image_url ? <img src={c.image_url} className="w-full h-full rounded-xl object-cover" alt="" /> : '🍽️'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{c.title}</p>
                  <p className="text-xs text-gray-500">by {c.donor_name}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available food near you */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg text-gray-900">Available Near You</h2>
          <Link to="/donations" className="text-sm text-primary-600 hover:underline">See all →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-64" />)}
          </div>
        ) : available.length === 0 ? (
          <EmptyState icon={Package} title="No donations available" description="Check back soon — new donations are posted regularly." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {available.map(d => (
              <DonationCard key={d.id} donation={d} onClick={() => navigate(`/donations/${d.id}`)} />
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/donations" className="card hover:shadow-card-hover transition-all flex items-center gap-4 group">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
            <Search size={22} className="text-primary-600" />
          </div>
          <div><p className="font-semibold text-gray-900">Browse Food</p><p className="text-sm text-gray-500">Find available donations</p></div>
        </Link>
        <Link to="/recipient/request-food" className="card hover:shadow-card-hover transition-all flex items-center gap-4 group">
          <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center group-hover:bg-accent-200 transition-colors">
            <ClipboardList size={22} className="text-accent-600" />
          </div>
          <div><p className="font-semibold text-gray-900">Request Food</p><p className="text-sm text-gray-500">Submit a specific request</p></div>
        </Link>
        <Link to="/recipient/my-claims" className="card hover:shadow-card-hover transition-all flex items-center gap-4 group">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Heart size={22} className="text-blue-600" />
          </div>
          <div><p className="font-semibold text-gray-900">My Claims</p><p className="text-sm text-gray-500">Track claimed donations</p></div>
        </Link>
      </div>
    </div>
  )
}
