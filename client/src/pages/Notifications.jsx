// Notifications.jsx
import { Bell, CheckCheck } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'
import { EmptyState, PageHeader } from '../components/ui/index'
import { motion } from 'framer-motion'

const typeColors = { success: 'bg-green-100 text-green-700', info: 'bg-blue-100 text-blue-700', warning: 'bg-yellow-100 text-yellow-700', error: 'bg-red-100 text-red-700' }
const typeIcons = { success: '✅', info: 'ℹ️', warning: '⚠️', error: '❌' }

export default function Notifications() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Notifications" subtitle={`${unreadCount} unread`}
        action={unreadCount > 0 && <button onClick={markAllRead} className="btn-secondary flex items-center gap-2 text-sm"><CheckCheck size={15} /> Mark all read</button>} />
      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up! Notifications will appear here." />
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <motion.div key={n.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              onClick={() => !n.is_read && markRead(n.id)}
              className={`card cursor-pointer transition-all ${n.is_read ? 'opacity-60' : 'border-l-4 border-primary-400 hover:shadow-card-hover'}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{typeIcons[n.type] || 'ℹ️'}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                    {!n.is_read && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
