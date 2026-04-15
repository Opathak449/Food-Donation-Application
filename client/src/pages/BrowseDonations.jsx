import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter, X } from 'lucide-react'
import api from '../api/axios'
import { SearchBar, DonationCard, Skeleton, EmptyState, Pagination } from '../components/ui/index'
import { Package } from 'lucide-react'

const CATEGORIES = ['Bakery', 'Cooked Meals', 'Produce', 'Non-Perishable', 'Dairy', 'Beverages', 'Other']
const DELIVERY_MODES = [
  { value: 'pickup', label: 'Pickup' },
  { value: 'donor_delivery', label: 'Donor Delivery' },
  { value: 'volunteer_delivery', label: 'Volunteer Delivery' },
]

const PER_PAGE = 12

export default function BrowseDonations() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    delivery_mode: '',
    is_perishable: '',
    city: '',
  })
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const params = { status: 'available', search, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '')) }
        const res = await api.get('/donations', { params })
        setDonations(res.data.data)
        setPage(1)
      } catch { }
      setLoading(false)
    }
    const t = setTimeout(fetch, 300)
    return () => clearTimeout(t)
  }, [search, filters])

  const paginated = donations.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(donations.length / PER_PAGE)

  const clearFilter = (key) => setFilters(f => ({ ...f, [key]: '' }))
  const activeFilters = Object.entries(filters).filter(([, v]) => v)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Available Donations</h1>
          <p className="text-gray-500">Browse and claim food donations in your community</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + filter bar */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search donations..." />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`btn-secondary flex items-center gap-2 px-4 py-2.5 ${showFilters ? 'bg-primary-50 border-primary-200' : ''}`}>
            <Filter size={16} /> Filters {activeFilters.length > 0 && <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFilters.length}</span>}
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="label">Category</label>
              <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))} className="select">
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Delivery Mode</label>
              <select value={filters.delivery_mode} onChange={e => setFilters(f => ({ ...f, delivery_mode: e.target.value }))} className="select">
                <option value="">Any Mode</option>
                {DELIVERY_MODES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Perishable</label>
              <select value={filters.is_perishable} onChange={e => setFilters(f => ({ ...f, is_perishable: e.target.value }))} className="select">
                <option value="">All</option>
                <option value="true">Perishable</option>
                <option value="false">Non-Perishable</option>
              </select>
            </div>
            <div>
              <label className="label">City</label>
              <input value={filters.city} onChange={e => setFilters(f => ({ ...f, city: e.target.value }))} className="input" placeholder="Search city..." />
            </div>
          </motion.div>
        )}

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map(([key, val]) => (
              <span key={key} className="flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                {val}
                <button onClick={() => clearFilter(key)}><X size={12} /></button>
              </span>
            ))}
            <button onClick={() => setFilters({ category: '', delivery_mode: '', is_perishable: '', city: '' })}
              className="text-sm text-gray-500 hover:text-gray-700">Clear all</button>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-6">{donations.length} donation{donations.length !== 1 ? 's' : ''} found</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-72" />)}
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState icon={Package} title="No donations found" description="Try adjusting your filters or check back later for new donations." />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginated.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <DonationCard donation={d} onClick={() => navigate(`/donations/${d.id}`)} />
                </motion.div>
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
