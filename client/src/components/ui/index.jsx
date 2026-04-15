import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Clock, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

// Status Badge
const statusStyles = {
  available: 'bg-green-100 text-green-700',
  claimed: 'bg-blue-100 text-blue-700',
  assigned: 'bg-purple-100 text-purple-700',
  in_transit: 'bg-orange-100 text-orange-700',
  completed: 'bg-gray-100 text-gray-700',
  expired: 'bg-red-100 text-red-700',
  cancelled: 'bg-red-100 text-red-500',
  open: 'bg-green-100 text-green-700',
  fulfilled: 'bg-gray-100 text-gray-600',
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  collected: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
}

export function StatusBadge({ status }) {
  const label = status?.replace(/_/g, ' ')
  return <span className={`badge capitalize ${statusStyles[status] || 'bg-gray-100 text-gray-600'}`}>{label}</span>
}

// KPI Card
export function KpiCard({ title, value, icon: Icon, color = 'primary', sub }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-50 text-accent-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    gray: 'bg-gray-100 text-gray-600',
  }
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-display font-bold text-gray-900">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  )
}

// Loading Spinner
export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' }
  return <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-primary-600 ${sizes[size]}`} />
}

// Empty State
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        {Icon && <Icon size={28} className="text-gray-400" />}
      </div>
      <h3 className="font-display font-semibold text-xl text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">{description}</p>
      {action}
    </div>
  )
}

// Modal
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/50" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`relative bg-white rounded-2xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-display font-semibold text-lg text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </div>
  )
}

// Confirm Dialog
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false }) {
  if (!isOpen) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        <button onClick={onConfirm} className={`flex-1 ${danger ? 'btn-danger' : 'btn-primary'}`}>{confirmLabel}</button>
      </div>
    </Modal>
  )
}

// Skeleton Loader
export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
}

// Pagination
export function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button onClick={() => onPage(page - 1)} disabled={page === 1}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onPage(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPage(page + 1)} disabled={page === totalPages}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

// Star Rating
export function StarRating({ rating, onRate, max = 5 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map(star => (
        <button key={star} onClick={() => onRate?.(star)}
          className={`text-2xl transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${onRate ? 'hover:text-yellow-400 cursor-pointer' : ''}`}>
          ★
        </button>
      ))}
    </div>
  )
}

// Search and Filter Bar
export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="input pl-10" />
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    </div>
  )
}

// Category icon map
export function CategoryBadge({ category }) {
  const cats = {
    'Bakery': { color: 'bg-amber-100 text-amber-700', emoji: '🍞' },
    'Cooked Meals': { color: 'bg-orange-100 text-orange-700', emoji: '🍲' },
    'Produce': { color: 'bg-green-100 text-green-700', emoji: '🥦' },
    'Non-Perishable': { color: 'bg-blue-100 text-blue-700', emoji: '🥫' },
    'Dairy': { color: 'bg-purple-100 text-purple-700', emoji: '🧀' },
    'Beverages': { color: 'bg-cyan-100 text-cyan-700', emoji: '🥤' },
    'Other': { color: 'bg-gray-100 text-gray-700', emoji: '🍽️' },
  }
  const c = cats[category] || cats['Other']
  return <span className={`badge ${c.color}`}>{c.emoji} {category}</span>
}

// Donation Card
export function DonationCard({ donation, onClick, actions }) {
  const timeLeft = donation.expiry_at ? Math.round((new Date(donation.expiry_at) - new Date()) / 3600000) : null
  return (
    <motion.div whileHover={{ y: -2 }} className="card hover:shadow-card-hover transition-all cursor-pointer" onClick={onClick}>
      <div className="relative mb-3">
        {donation.image_url ? (
          <img src={donation.image_url} alt={donation.title}
            className="w-full h-40 object-cover rounded-xl bg-gray-100" />
        ) : (
          <div className="w-full h-40 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl flex items-center justify-center text-5xl">
            🍽️
          </div>
        )}
        <div className="absolute top-2 left-2"><StatusBadge status={donation.status} /></div>
        {donation.is_perishable && <div className="absolute top-2 right-2"><span className="badge bg-red-100 text-red-600">⏰ Perishable</span></div>}
      </div>
      <CategoryBadge category={donation.category} />
      <h3 className="font-display font-semibold text-gray-900 mt-2 mb-1 line-clamp-1">{donation.title}</h3>
      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{donation.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>📦 {donation.quantity} {donation.unit}</span>
        <span>📍 {donation.city}</span>
      </div>
      {timeLeft !== null && timeLeft > 0 && (
        <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
          <Clock size={11} /> Expires in {timeLeft}h
        </div>
      )}
      {donation.donor_name && <p className="text-xs text-gray-400 mt-2">By {donation.donor_name}</p>}
      {actions && <div className="mt-3 flex gap-2" onClick={e => e.stopPropagation()}>{actions}</div>}
    </motion.div>
  )
}

// Page header component
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="page-header">{title}</h1>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
