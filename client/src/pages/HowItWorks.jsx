import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const steps = [
  { role: '🤝 Donors', color: 'from-primary-500 to-primary-700', steps: ['Register as a donor', 'Create a food donation listing', 'Add photos and details', 'Choose delivery mode', 'Wait for a recipient to claim', 'Complete the handoff'] },
  { role: '🙏 Recipients', color: 'from-blue-500 to-blue-700', steps: ['Create an account', 'Browse available donations', 'Filter by location & type', 'Claim what you need', 'Coordinate pickup or wait for delivery', 'Leave feedback after receipt'] },
  { role: '🚴 Volunteers', color: 'from-purple-500 to-purple-700', steps: ['Sign up as a volunteer', 'Browse available delivery tasks', 'Accept tasks near you', 'Pick up from the donor', 'Deliver to the recipient', 'Mark task complete'] },
]

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-5xl font-bold mb-4">How It Works</h1>
          <p className="text-gray-300 text-xl">Simple steps for every role on FoodShare</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((role, i) => (
            <motion.div key={role.role} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="card">
              <div className={`bg-gradient-to-br ${role.color} text-white rounded-xl p-4 mb-5 text-center`}>
                <h3 className="font-display text-xl font-bold">{role.role}</h3>
              </div>
              <ol className="space-y-3">
                {role.steps.map((step, j) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0 mt-0.5">{j + 1}</span>
                    <span className="text-sm text-gray-600">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to get started?</h2>
          <Link to="/register" className="btn-primary text-base px-10 py-3">Join FoodShare</Link>
        </div>
      </div>
    </div>
  )
}
