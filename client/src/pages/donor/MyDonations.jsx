import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlusCircle, Edit2, Trash2, Eye, Package } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { StatusBadge, CategoryBadge, ConfirmDialog, SearchBar, PageHeader, EmptyState, Skeleton } from '../../components/ui/index'

export default function MyDonations() {
  const navigate = useNavigate()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const fetchDonations = () => {
    setLoading(true)
    api.get('/donations/my').then(res => setDonations(res.data.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchDonations() }, [])

  const handleDelete = async () => {
    try {
      await api.delete(`/donations/${deleteId}`)
      toast.success('Donation deleted.')
      setDeleteId(null)
      fetchDonations()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete donation')
    }
  }

  const filtered = donations.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader title="My Donations" subtitle={`${donations.length} total donations`}
        action={<Link to="/donor/new-donation" className="btn-primary flex items-center gap-2"><PlusCircle size={18} /> New Donation</Link>} />

      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search your donations..." />
      </div>

      {loading ? (
        <div className="space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Package} title="No donations yet" description="Post your first food donation and start making a difference."
          action={<Link to="/donor/new-donation" className="btn-primary">Post Donation</Link>} />
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Food</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Quantity</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Claimed By</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((d, i) => (
                <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl overflow-hidden flex-shrink-0">
                        {d.image_url ? <img src={d.image_url} className="w-full h-full object-cover" alt="" /> : '🍽️'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{d.title}</p>
                        <p className="text-xs text-gray-500">{d.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell"><CategoryBadge category={d.category} /></td>
                  <td className="px-6 py-4 hidden sm:table-cell text-sm text-gray-600">{d.quantity} {d.unit}</td>
                  <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
                  <td className="px-6 py-4 hidden lg:table-cell text-sm text-gray-600">{d.recipient_name || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => navigate(`/donations/${d.id}`)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700" title="View">
                        <Eye size={15} />
                      </button>
                      {d.status === 'available' && (
                        <>
                          <button onClick={() => navigate(`/donor/edit/${d.id}`)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600" title="Edit">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => setDeleteId(d.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Donation" message="Are you sure you want to delete this donation? This action cannot be undone."
        confirmLabel="Delete" danger />
    </div>
  )
}
