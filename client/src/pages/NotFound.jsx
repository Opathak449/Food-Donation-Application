import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="text-8xl mb-6">🍽️</div>
        <h1 className="font-display text-7xl font-bold text-gray-200 mb-2">404</h1>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Looks like this page went missing — kind of like food that should have been donated instead of thrown away. Let's get you back on track.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => window.history.back()} className="btn-secondary flex items-center gap-2">
            <ArrowLeft size={16} /> Go Back
          </button>
          <Link to="/" className="btn-primary flex items-center gap-2">
            <Home size={16} /> Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
