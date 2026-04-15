// MyClaims.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckSquare } from 'lucide-react'
import api from '../../api/axios'
import { StatusBadge, EmptyState, Skeleton, PageHeader, DonationCard } from '../../components/ui/index'

export function MyClaims() {
  const navigate = useNavigate()
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/donations/claims').then(res => setClaims(res.data.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader title="My Claims" subtitle={`${claims.length} claimed donation${claims.length !== 1 ? 's' : ''}`} />
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-72" />)}
        </div>
      ) : claims.length === 0 ? (
        <EmptyState icon={CheckSquare} title="No claims yet" description="Browse available donations and claim food you need." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {claims.map(c => <DonationCard key={c.id} donation={c} onClick={() => navigate(`/donations/${c.id}`)} />)}
        </div>
      )}
    </div>
  )
}

export default MyClaims
