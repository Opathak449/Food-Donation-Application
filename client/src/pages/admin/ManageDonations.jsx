import { useState, useEffect } from 'react'
import { Package } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { SearchBar, StatusBadge, CategoryBadge, PageHeader, Skeleton, EmptyState } from '../../components/ui/index'
import { motion } from 'framer-motion'

export default function ManageDonations() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const fetch = () => {
    setLoading(true)
    api.get('/donations', { params: { search, status: statusFilter } })
      .then(r => setDonations(r.data.data)).finally(() => setLoading(false))
  }
  useEffect(() => { const t = setTimeout(fetch, 300); return () => clearTimeout(t) }, [search, statusFilter])

  const updateStatus = async (id, status) => {
    setUpdatingId(id)
    try { await api.patch(`/donations/${id}/status`, { status }); toast.success('Status updated'); fetch() }
    catch { toast.error('Failed to update') }
    finally { setUpdatingId(null) }
  }

  const statuses = ['available', 'claimed', 'assigned', 'in_transit', 'completed', 'expired', 'cancelled']

  return (
    <div>
      <PageHeader title="Manage Donations" subtitle={`${donations.length} total donations`} />
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search donations..." /></div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="select sm:w-44">
          <option value="">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <div className="space-y-3">{Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
        : donations.length === 0 ? <EmptyState icon={Package} title="No donations found" description="Adjust your filters to find donations." />
        : <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Food</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Category</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Donor</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">City</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {donations.map((d, i) => (
                <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-lg overflow-hidden">
                        {d.image_url ? <img src={d.image_url} className="w-full h-full object-cover" alt="" /> : '🍽️'}
                      </div>
                      <span className="font-medium text-sm text-gray-900">{d.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell"><CategoryBadge category={d.category} /></td>
                  <td className="px-6 py-4 hidden sm:table-cell text-sm text-gray-600">{d.donor_name}</td>
                  <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
                  <td className="px-6 py-4 hidden lg:table-cell text-sm text-gray-500">{d.city}</td>
                  <td className="px-6 py-4">
                    <select disabled={updatingId === d.id}
                      onChange={e => { if (e.target.value) updateStatus(d.id, e.target.value) }}
                      value="" className="select text-xs py-1 px-2 w-32">
                      <option value="">Change...</option>
                      {statuses.filter(s => s !== d.status).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>}
    </div>
  )
}
