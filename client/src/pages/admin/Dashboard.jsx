import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Package, ClipboardList, Truck, TrendingUp, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import api from '../../api/axios'
import { KpiCard, StatusBadge, Skeleton, PageHeader } from '../../components/ui/index'
import { motion } from 'framer-motion'

const COLORS = ['#22c55e', '#3b82f6', '#f97316', '#a855f7', '#ef4444', '#6b7280']

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/analytics').then(res => setData(res.data.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div>
      <PageHeader title="Admin Analytics" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
    </div>
  )

  const { stats, usersByRole, donationsByCategory, donationsByStatus, recentDonations } = data

  return (
    <div>
      <PageHeader title="Platform Analytics" subtitle="Real-time overview of FoodShare platform" />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Total Donations" value={stats.totalDonations} icon={Package} color="primary" />
        <KpiCard title="Available Now" value={stats.activeDonations} icon={TrendingUp} color="accent" />
        <KpiCard title="Completed" value={stats.completedDonations} icon={CheckCircle} color="gray" />
        <KpiCard title="Expired" value={stats.expiredDonations} icon={XCircle} color="red" />
        <KpiCard title="Total Users" value={stats.totalUsers} icon={Users} color="blue" />
        <KpiCard title="Food Requests" value={stats.totalRequests} icon={ClipboardList} color="purple" />
        <KpiCard title="Volunteer Tasks" value={stats.totalTasks} icon={Truck} color="accent" />
        <KpiCard title="Expired" value={stats.expiredDonations} icon={AlertCircle} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Donations by Status */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
          <h3 className="font-display font-semibold text-lg mb-4">Donations by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={donationsByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label={({ status, count }) => `${status}: ${count}`}>
                {donationsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Users by Role */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card">
          <h3 className="font-display font-semibold text-lg mb-4">Users by Role</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={usersByRole} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="role" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Donations by Category */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card mb-6">
        <h3 className="font-display font-semibold text-lg mb-4">Donations by Category</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={donationsByCategory} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="category" type="category" tick={{ fontSize: 12 }} width={100} />
            <Tooltip />
            <Bar dataKey="count" fill="#f97316" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Donations Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-display font-semibold text-lg">Recent Donations</h3>
          <Link to="/admin/donations" className="text-sm text-primary-600 hover:underline">View all →</Link>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Food</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Donor</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">City</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentDonations.map(d => (
              <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-lg overflow-hidden">
                      {d.image_url ? <img src={d.image_url} className="w-full h-full object-cover" alt="" /> : '🍽️'}
                    </div>
                    <span className="font-medium text-sm text-gray-900">{d.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell text-sm text-gray-600">{d.donor_name}</td>
                <td className="px-6 py-4 hidden sm:table-cell text-sm text-gray-600">{d.city}</td>
                <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
                <td className="px-6 py-4 hidden lg:table-cell text-sm text-gray-400">{new Date(d.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
