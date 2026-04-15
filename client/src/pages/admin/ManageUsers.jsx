import { useState, useEffect } from 'react'
import { Users, Shield, UserCheck, UserX } from 'lucide-react'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import { SearchBar, PageHeader, Skeleton, ConfirmDialog } from '../../components/ui/index'
import { motion } from 'framer-motion'

const roleBadge = { donor: 'bg-primary-100 text-primary-700', recipient: 'bg-blue-100 text-blue-700', volunteer: 'bg-purple-100 text-purple-700', admin: 'bg-red-100 text-red-700' }

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [toggleId, setToggleId] = useState(null)
  const [toggleUser, setToggleUser] = useState(null)

  const fetch = () => {
    setLoading(true)
    api.get('/admin/users', { params: { role: roleFilter, search } })
      .then(r => setUsers(r.data.data)).finally(() => setLoading(false))
  }
  useEffect(() => { fetch() }, [search, roleFilter])

  const handleToggle = async () => {
    try {
      await api.patch(`/admin/users/${toggleId}/toggle`)
      toast.success('User status updated.')
      setToggleId(null); setToggleUser(null); fetch()
    } catch { toast.error('Failed to update user') }
  }

  return (
    <div>
      <PageHeader title="Manage Users" subtitle={`${users.length} users on the platform`} />
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search by name or email..." /></div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="select sm:w-40">
          <option value="">All Roles</option>
          <option value="donor">Donor</option>
          <option value="recipient">Recipient</option>
          <option value="volunteer">Volunteer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? <div className="space-y-3">{Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
        : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Role</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">City</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Joined</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                        {u.full_name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{u.full_name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`badge capitalize ${roleBadge[u.role] || 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-sm text-gray-600">{u.city || '—'}</td>
                  <td className="px-6 py-4 hidden sm:table-cell text-sm text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {u.is_active ? '✓ Active' : '✗ Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.role !== 'admin' && (
                      <button onClick={() => { setToggleId(u.id); setToggleUser(u) }}
                        className={`p-1.5 rounded-lg transition-colors ${u.is_active ? 'hover:bg-red-50 text-gray-400 hover:text-red-600' : 'hover:bg-green-50 text-gray-400 hover:text-green-600'}`}>
                        {u.is_active ? <UserX size={15} /> : <UserCheck size={15} />}
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog isOpen={!!toggleId} onClose={() => { setToggleId(null); setToggleUser(null) }} onConfirm={handleToggle}
        title={toggleUser?.is_active ? 'Deactivate User' : 'Activate User'}
        message={`Are you sure you want to ${toggleUser?.is_active ? 'deactivate' : 'activate'} ${toggleUser?.full_name}?`}
        confirmLabel={toggleUser?.is_active ? 'Deactivate' : 'Activate'} danger={toggleUser?.is_active} />
    </div>
  )
}
