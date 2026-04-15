import { useState, useEffect } from 'react'
import api from '../api/axios'
import { useAuth } from '../features/auth/AuthContext'

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    if (!user) return
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data.data)
      setUnreadCount(res.data.unreadCount)
    } catch {}
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [user])

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`)
    fetchNotifications()
  }

  const markAllRead = async () => {
    await api.patch('/notifications/read-all')
    fetchNotifications()
  }

  return { notifications, unreadCount, markRead, markAllRead, refetch: fetchNotifications }
}
