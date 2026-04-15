import { useState, useEffect } from 'react'
import { ClipboardList } from 'lucide-react'
import api from '../../api/axios'
import { StatusBadge, PageHeader, Skeleton, EmptyState, SearchBar } from '../../components/ui/index'
import { motion } from 'framer-motion'

const urgencyColors = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-orange-100 text-orange-700', critical: 'bg-red-100 text-red-700' }

export default function ManageRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    setLoading(true)
    api.get('/requests', { params: { status: statusFilter } })
      .then(r => setRequests(r.data.data.filter(req => !search || req.title.toLowerCase().includes(search.toLowerCase()))))
      .finally(() => setLoading(false))
  }, [statusFilter, search])

  return (
    <div>
      <PageHeader title="Food Requests" subtitle={`${requests.length} requests from recipients`} />
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search requests..." /></div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select sm:w-40">
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? <div className="space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
        : requests.length === 0 ? <EmptyState icon={ClipboardList} title="No requests found" description="No food requests match your current filters." />
        : <div className="space-y-3">
          {requests.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{r.title}</h3>
                    <span className={`badge capitalize ${urgencyColors[r.urgency_level]}`}>🔥 {r.urgency_level}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-sm text-gray-500">{r.category} · Qty: {r.quantity_needed} · {r.city || 'No city'}</p>
                  {r.description && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{r.description}</p>}
                  <p className="text-xs text-gray-400 mt-1">By: {r.recipient_name} · {new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>}
    </div>
  )
}
