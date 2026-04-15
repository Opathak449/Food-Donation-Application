import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Clock, Package, Truck, User, Phone, Star, Loader2 } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../features/auth/AuthContext'
import { StatusBadge, CategoryBadge, Modal, StarRating } from '../components/ui/index'
import toast from 'react-hot-toast'

export default function DonationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [donation, setDonation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)

  useEffect(() => {
    api.get(`/donations/${id}`)
      .then(res => setDonation(res.data.data))
      .catch(() => toast.error('Donation not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleClaim = async () => {
    setClaiming(true)
    try {
      await api.patch(`/donations/${id}/claim`)
      toast.success('Donation claimed successfully!')
      const res = await api.get(`/donations/${id}`)
      setDonation(res.data.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to claim donation')
    } finally {
      setClaiming(false)
    }
  }

  const handleFeedback = async () => {
    if (!rating) return toast.error('Please select a rating')
    setSubmittingFeedback(true)
    try {
      await api.post('/feedback', { donation_id: id, rating, comment })
      toast.success('Thank you for your feedback!')
      setShowFeedback(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback')
    } finally {
      setSubmittingFeedback(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
    </div>
  )

  if (!donation) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Donation not found</p>
      <Link to="/donations" className="btn-primary">Browse Donations</Link>
    </div>
  )

  const isExpired = donation.expiry_at && new Date(donation.expiry_at) < new Date()
  const canClaim = user?.role === 'recipient' && donation.status === 'available' && !isExpired
  const canFeedback = user?.role === 'recipient' && donation.claimed_by_recipient_id === user.id && donation.status === 'completed'
  const deliveryLabels = { pickup: '🚶 Pickup Only', donor_delivery: '🚗 Donor Will Deliver', volunteer_delivery: '🚴 Volunteer Delivery' }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Image + main info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden p-0">
              {donation.image_url ? (
                <img src={donation.image_url} alt={donation.title} className="w-full h-72 object-cover" />
              ) : (
                <div className="w-full h-72 bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center text-8xl">🍽️</div>
              )}
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <StatusBadge status={donation.status} />
                  <CategoryBadge category={donation.category} />
                  {donation.is_perishable ? <span className="badge bg-red-100 text-red-600">⏰ Perishable</span> : <span className="badge bg-green-100 text-green-600">📦 Non-Perishable</span>}
                </div>
                <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">{donation.title}</h1>
                <p className="text-gray-600 leading-relaxed">{donation.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Quantity</p>
                    <p className="font-semibold text-gray-900">📦 {donation.quantity} {donation.unit}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Delivery Mode</p>
                    <p className="font-semibold text-gray-900 text-sm">{deliveryLabels[donation.delivery_mode]}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="font-semibold text-gray-900 text-sm">📍 {donation.city}</p>
                  </div>
                  {donation.cooked_at && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Prepared</p>
                      <p className="font-semibold text-gray-900 text-sm">{new Date(donation.cooked_at).toLocaleString()}</p>
                    </div>
                  )}
                  {donation.expiry_at && (
                    <div className={`rounded-xl p-3 ${isExpired ? 'bg-red-50' : 'bg-amber-50'}`}>
                      <p className="text-xs text-gray-500 mb-1">Expires</p>
                      <p className={`font-semibold text-sm ${isExpired ? 'text-red-600' : 'text-amber-700'}`}>
                        {isExpired ? '⚠️ Expired' : `⏰ ${new Date(donation.expiry_at).toLocaleString()}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Action panel */}
          <div className="space-y-5">
            {/* Claim action */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card">
              <h3 className="font-display font-semibold text-lg mb-4">
                {donation.status === 'available' ? 'Claim This Donation' : 'Donation Status'}
              </h3>
              <StatusBadge status={donation.status} />
              <p className="text-sm text-gray-500 mt-3 mb-4">
                {donation.status === 'available' && !isExpired && 'This food is available for claiming. Act fast!'}
                {donation.status === 'claimed' && 'This donation has been claimed.'}
                {donation.status === 'assigned' && 'A volunteer has been assigned for delivery.'}
                {donation.status === 'in_transit' && 'Food is on the way!'}
                {donation.status === 'completed' && 'This donation was completed successfully.'}
                {donation.status === 'expired' || isExpired ? 'This donation has expired.' : ''}
              </p>

              {canClaim && (
                <button onClick={handleClaim} disabled={claiming} className="btn-primary w-full flex items-center justify-center gap-2">
                  {claiming ? <><Loader2 size={16} className="animate-spin" /> Claiming...</> : '🙌 Claim This Donation'}
                </button>
              )}
              {!user && (
                <Link to="/login" className="btn-primary w-full text-center block">Login to Claim</Link>
              )}
              {canFeedback && (
                <button onClick={() => setShowFeedback(true)} className="btn-accent w-full mt-2 flex items-center justify-center gap-2">
                  <Star size={16} /> Leave Feedback
                </button>
              )}
            </motion.div>

            {/* Donor info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="card">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><User size={16} /> Donor</h3>
              <p className="font-semibold text-gray-900">{donation.donor_name}</p>
              {donation.donor_phone && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Phone size={12} /> {donation.donor_phone}</p>
              )}
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-2"><MapPin size={12} /> {donation.address}, {donation.city}</p>
            </motion.div>

            {/* Recipient info if claimed */}
            {donation.recipient_name && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card border-l-4 border-blue-400">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><User size={16} /> Claimed By</h3>
                <p className="font-semibold text-gray-900">{donation.recipient_name}</p>
                {donation.recipient_phone && <p className="text-sm text-gray-500">{donation.recipient_phone}</p>}
              </motion.div>
            )}

            {/* Volunteer info */}
            {donation.volunteer_name && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card border-l-4 border-purple-400">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Truck size={16} /> Volunteer</h3>
                <p className="font-semibold text-gray-900">{donation.volunteer_name}</p>
                {donation.volunteer_phone && <p className="text-sm text-gray-500">{donation.volunteer_phone}</p>}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <Modal isOpen={showFeedback} onClose={() => setShowFeedback(false)} title="Rate Your Experience">
        <div className="space-y-4">
          <p className="text-gray-600">How was the food donation experience?</p>
          <div className="flex justify-center">
            <StarRating rating={rating} onRate={setRating} />
          </div>
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            className="input" rows={3} placeholder="Share your experience (optional)..." />
          <button onClick={handleFeedback} disabled={submittingFeedback} className="btn-primary w-full">
            {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
