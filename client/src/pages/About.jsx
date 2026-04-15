// About.jsx
import { motion } from 'framer-motion'
import { Heart, Target, Eye, Users } from 'lucide-react'

export function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-5xl mb-4">🌱</div>
            <h1 className="font-display text-5xl font-bold mb-4">Our Mission</h1>
            <p className="text-xl text-primary-100 leading-relaxed">FoodShare was built on a simple belief: no food should go to waste while people go hungry. We're a community platform connecting surplus food with those who need it most.</p>
          </motion.div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Target, title: 'Our Goal', text: 'Eliminate food insecurity in communities by making surplus food accessible to everyone who needs it.', color: 'bg-primary-100 text-primary-600' },
            { icon: Eye, title: 'Our Vision', text: 'A world where zero food goes to waste, and every person has access to nutritious meals every day.', color: 'bg-accent-100 text-accent-600' },
            { icon: Heart, title: 'Our Values', text: 'Community, dignity, sustainability, and compassion drive every decision we make on this platform.', color: 'bg-blue-100 text-blue-600' },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="card text-center">
              <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}><item.icon size={24} /></div>
              <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
        <div className="card">
          <h2 className="font-display text-2xl font-bold mb-4">The Problem We Solve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">🗑️ Food Waste Crisis</h3>
              <p className="text-gray-600 text-sm">Over 1.3 billion tons of food is wasted globally each year — roughly one-third of all food produced. In cities, restaurants, bakeries, and households discard food daily that could feed thousands.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">🌍 Food Insecurity</h3>
              <p className="text-gray-600 text-sm">Simultaneously, over 800 million people worldwide face hunger. In every city, families struggle to put food on the table. FoodShare bridges this painful gap with technology and community.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
