import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Truck, CheckSquare, Clock, Star, MapPin, Phone, Loader2 } from 'lucide-react'
import api from '../../api/axios'
import { useAuth } from '../../features/auth/AuthContext'
import { KpiCard, StatusBadge, EmptyState, Skeleton, PageHeader, ConfirmDialog } from '../../components/ui/index'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

// ─── Dashboard ───────────────────────────────────────────────────────────────
export function VolunteerDashboard() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [available, setAvailable] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/tasks/my'), api.get('/tasks', { params: { status: 'pending' } })])
      .then(([myRes, avRes]) => { setTasks(myRes.data.data); setAvailable(avRes.data.data) })
      .finally(() => setLoading(false))
  }, [])

  const active = tasks.filter(t => !['delivered', 'cancelled'].includes(t.status))
  const completed = tasks.filter(t => t.status === 'delivered')

  return (
    <div>
      <PageHeader title={`Ready to help, ${user?.full_name?.split(' ')[0]}! 🚴`} subtitle="Your volunteer dashboard" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Available Tasks" value={available.length} icon={Clock} color="accent" />
        <KpiCard title="Active Tasks" value={active.length} icon={Truck} color="primary" />
        <KpiCard title="Completed" value={completed.length} icon={CheckSquare} color="gray" />
        <KpiCard title="Total Served" value={tasks.length} icon={Star} color="blue" />
      </div>
      {completed.length > 0 && (
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl p-6 text-white mb-6 flex items-center gap-4">
          <div className="text-4xl">🏆</div>
          <div><h3 className="font-display text-xl font-bold">Community Hero!</h3>
            <p className="text-purple-100">You've completed {completed.length} delivery task{completed.length > 1 ? 's' : ''}. You're making a real difference!</p>
          </div>
        </div>
      )}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg">My Active Tasks</h2>
          <Link to="/volunteer/my-tasks" className="text-sm text-primary-600 hover:underline">View all →</Link>
        </div>
        {loading ? <Skeleton className="h-32" /> : active.length === 0
          ? <EmptyState icon={Truck} title="No active tasks" description="Accept available tasks to start helping your community."
              action={<Link to="/volunteer/tasks" className="btn-primary">Browse Tasks</Link>} />
          : <div className="space-y-3">{active.slice(0, 3).map(t => (
              <div key={t.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="text-2xl">🚴</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{t.donation_title}</p>
                  <p className="text-xs text-gray-500">{t.pickup_address} → {t.delivery_address}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>))}
          </div>}
      </div>
    </div>
  )
}

// ─── Available Tasks ─────────────────────────────────────────────────────────
export function AvailableTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(null)

  const fetch = () => { setLoading(true); api.get('/tasks', { params: { status: 'pending' } }).then(r => setTasks(r.data.data)).finally(() => setLoading(false)) }
  useEffect(() => { fetch() }, [])

  const accept = async (id) => {
    setAccepting(id)
    try { await api.patch(`/tasks/${id}/accept`); toast.success('Task accepted! 🎉'); fetch() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to accept task') }
    finally { setAccepting(null) }
  }

  return (
    <div>
      <PageHeader title="Available Tasks" subtitle="Pickup and delivery tasks in your area" />
      {loading ? <div className="space-y-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
        : tasks.length === 0 ? <EmptyState icon={Truck} title="No tasks available" description="Check back soon — new delivery tasks are posted when donations are claimed." />
        : <div className="space-y-4">
          {tasks.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🚴</span>
                    <h3 className="font-display font-semibold text-gray-900">{t.donation_title}</h3>
                    <StatusBadge status={t.status} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5"><MapPin size={14} className="text-primary-500" /> <span className="font-medium">Pickup:</span> {t.pickup_address}</div>
                    <div className="flex items-center gap-1.5"><MapPin size={14} className="text-accent-500" /> <span className="font-medium">Deliver to:</span> {t.delivery_address || 'TBD'}</div>
                    {t.donor_name && <div className="flex items-center gap-1.5"><span className="font-medium">Donor:</span> {t.donor_name}</div>}
                    {t.donor_phone && <div className="flex items-center gap-1.5"><Phone size={14} /> {t.donor_phone}</div>}
                  </div>
                  {t.notes && <p className="text-sm text-gray-500 mt-2 italic">{t.notes}</p>}
                </div>
                <button onClick={() => accept(t.id)} disabled={accepting === t.id}
                  className="btn-primary self-start flex items-center gap-2 whitespace-nowrap">
                  {accepting === t.id ? <><Loader2 size={14} className="animate-spin" /> Accepting...</> : '✅ Accept Task'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>}
    </div>
  )
}

// ─── My Tasks ────────────────────────────────────────────────────────────────
export function MyTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const fetch = () => { setLoading(true); api.get('/tasks/my').then(r => setTasks(r.data.data)).finally(() => setLoading(false)) }
  useEffect(() => { fetch() }, [])

  const updateStatus = async (id, status) => {
    setUpdatingId(id)
    try {
      await api.patch(`/tasks/${id}/status`, { status })
      toast.success(`Status updated to: ${status}`)
      fetch()
    } catch { toast.error('Failed to update status') }
    finally { setUpdatingId(null) }
  }

  const nextAction = (t) => {
    if (t.status === 'accepted') return { status: 'collected', label: '📦 Mark Collected', color: 'btn-accent' }
    if (t.status === 'collected') return { status: 'delivered', label: '✅ Mark Delivered', color: 'btn-primary' }
    return null
  }

  return (
    <div>
      <PageHeader title="My Tasks" subtitle={`${tasks.length} total tasks assigned to you`} />
      {loading ? <div className="space-y-4">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-36" />)}</div>
        : tasks.length === 0 ? <EmptyState icon={CheckSquare} title="No tasks yet" description="Browse available tasks and accept one to get started."
            action={<Link to="/volunteer/tasks" className="btn-primary">Browse Tasks</Link>} />
        : <div className="space-y-4">
          {tasks.map((t, i) => {
            const action = nextAction(t)
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{t.donation_title}</h3>
                      <StatusBadge status={t.status} />
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📦 Pickup: {t.pickup_address}</p>
                      {t.delivery_address && <p>🏠 Deliver: {t.delivery_address}</p>}
                      {t.donor_name && <p>👤 Donor: {t.donor_name} {t.donor_phone && `· ${t.donor_phone}`}</p>}
                      {t.recipient_name && <p>🙏 Recipient: {t.recipient_name} {t.recipient_phone && `· ${t.recipient_phone}`}</p>}
                    </div>
                    {t.completed_at && <p className="text-xs text-green-600 mt-2">✅ Completed: {new Date(t.completed_at).toLocaleString()}</p>}
                  </div>
                  {action && (
                    <button onClick={() => updateStatus(t.id, action.status)} disabled={updatingId === t.id}
                      className={`${action.color} flex items-center gap-2 whitespace-nowrap self-start`}>
                      {updatingId === t.id ? <><Loader2 size={14} className="animate-spin" /> Updating...</> : action.label}
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>}
    </div>
  )
}

export default VolunteerDashboard
