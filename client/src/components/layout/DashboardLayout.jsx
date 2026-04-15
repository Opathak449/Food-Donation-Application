import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, LayoutDashboard, PlusCircle, List, BookOpen, ClipboardList, Users, BarChart2, Bell, User, LogOut, Menu, X, Package, Truck, CheckSquare, ChevronRight } from 'lucide-react'
import { useAuth } from '../../features/auth/AuthContext'
import { useNotifications } from '../../hooks/useNotifications'

const roleMenus = {
  donor: [
    { to: '/donor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/donor/new-donation', icon: PlusCircle, label: 'New Donation' },
    { to: '/donor/my-donations', icon: Package, label: 'My Donations' },
  ],
  recipient: [
    { to: '/recipient/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/donations', icon: List, label: 'Browse Food' },
    { to: '/recipient/my-claims', icon: CheckSquare, label: 'My Claims' },
    { to: '/recipient/my-requests', icon: ClipboardList, label: 'My Requests' },
    { to: '/recipient/request-food', icon: BookOpen, label: 'Request Food' },
  ],
  volunteer: [
    { to: '/volunteer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/volunteer/tasks', icon: Truck, label: 'Available Tasks' },
    { to: '/volunteer/my-tasks', icon: CheckSquare, label: 'My Tasks' },
  ],
  admin: [
    { to: '/admin/dashboard', icon: BarChart2, label: 'Analytics' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/donations', icon: Package, label: 'Donations' },
    { to: '/admin/requests', icon: ClipboardList, label: 'Requests' },
  ],
}

const roleColors = { donor: 'text-primary-600 bg-primary-100', recipient: 'text-blue-600 bg-blue-100', volunteer: 'text-purple-600 bg-purple-100', admin: 'text-red-600 bg-red-100' }

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { unreadCount } = useNotifications()

  const menu = roleMenus[user?.role] || []

  const handleLogout = () => { logout(); navigate('/') }

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? 'p-4' : 'p-5'}`}>
      <Link to="/" className="flex items-center gap-2 mb-8 group">
        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
          <Heart size={18} className="text-white fill-white" />
        </div>
        <span className="font-display font-bold text-xl text-gray-900">Food<span className="text-primary-600">Share</span></span>
      </Link>

      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-6">
        <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
          {user?.full_name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{user?.full_name}</p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${roleColors[user?.role]}`}>{user?.role}</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {menu.map(item => {
          const active = location.pathname === item.to
          return (
            <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
              <item.icon size={18} />
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      <div className="mt-6 pt-4 border-t border-gray-100 space-y-1">
        <Link to="/notifications" onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
          <Bell size={18} />
          Notifications
          {unreadCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>}
        </Link>
        <Link to="/profile" onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
          <User size={18} /> Profile
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 md:hidden shadow-xl">
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-16 flex items-center gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <Link to="/notifications" className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <Bell size={20} />
            {unreadCount > 0 && <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{unreadCount}</span>}
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
