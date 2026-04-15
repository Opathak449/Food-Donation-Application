import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Trash2, PlusCircle } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { StatusBadge, EmptyState, Skeleton, PageHeader, ConfirmDialog } from '../../components/ui/index'

const urgencyColors = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-orange-100 text-orange-700', critical: 'bg-red-100 text-red-700' }

export default function MyRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)

  const fetch = () => { setLoading(true); api.get('/requests/my').then(r => setRequests(r.data.data)).finally(() => setLoading(false)) }
  useEffect(() => { fetch() }, [])

  const handleDelete = async () => {
    try { await api.delete(`/requests/${deleteId}`); toast.success('Request deleted.'); setDeleteId(null); fetch() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
  }

  return (
    <div>
      <PageHeader title="My Food Requests" subtitle="Track your submitted food requests"
        action={<Link to="/recipient/request-food" className="btn-primary flex items-center gap-2"><PlusCircle size={16} /> New Request</Link>} />
      {loading ? <div className="space-y-3">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
        : requests.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No requests" description="Submit a food request to let donors know what you need."
            action={<Link to="/recipient/request-food" className="btn-primary">Request Food</Link>} />
        ) : (
          <div className="space-y-3">
            {requests.map(r => (
              <div key={r.id} className="card flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{r.title}</h3>
                    <span className={`badge capitalize ${urgencyColors[r.urgency_level]}`}>🔥 {r.urgency_level}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-sm text-gray-500">{r.category} · {r.quantity_needed} needed · {r.city}</p>
                  {r.description && <p className="text-sm text-gray-400 mt-1 line-clamp-1">{r.description}</p>}
                  <p className="text-xs text-gray-400 mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                {r.status === 'open' && (
                  <button onClick={() => setDeleteId(r.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors self-end sm:self-center">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Request" message="Are you sure you want to cancel this food request?" confirmLabel="Delete" danger />
    </div>
  )
}
