import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ArrowRight, Users, Package, Truck, Star, CheckCircle, Leaf, ShieldCheck, Zap } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

const stats = [
  { value: '10,000+', label: 'Meals Donated', color: 'text-primary-600' },
  { value: '2,400+', label: 'Families Helped', color: 'text-accent-600' },
  { value: '500+', label: 'Active Volunteers', color: 'text-blue-600' },
  { value: '320+', label: 'Tons Food Saved', color: 'text-purple-600' },
]

const steps = [
  { icon: Package, title: 'Donors List Surplus Food', desc: 'Restaurants, bakeries, and households post available food with details, photos, and pickup time.', color: 'bg-primary-50 text-primary-600' },
  { icon: Users, title: 'Recipients Browse & Claim', desc: 'People in need browse nearby donations and claim what they need with a single tap.', color: 'bg-accent-50 text-accent-600' },
  { icon: Truck, title: 'Volunteers Deliver', desc: 'Our amazing volunteers bridge the gap, picking up and delivering food where it\'s needed most.', color: 'bg-blue-50 text-blue-600' },
  { icon: Heart, title: 'Community Thrives', desc: 'Together we reduce waste, fight hunger, and build a more compassionate community.', color: 'bg-purple-50 text-purple-600' },
]

const testimonials = [
  { name: 'Sarah M.', role: 'Bakery Owner', text: 'Every evening we used to throw out dozens of loaves. Now they go to families who need them. FoodShare changed how I see my business.', rating: 5 },
  { name: 'Marcus J.', role: 'Community Shelter', text: 'We serve 80 families daily. FoodShare has been a game-changer — we receive quality food donations every single day.', rating: 5 },
  { name: 'Jenny W.', role: 'Volunteer', text: 'I volunteer twice a week. The app makes it so easy to find tasks near me. Knowing I\'m helping people is incredibly fulfilling.', rating: 5 },
]

const categories = [
  { emoji: '🍞', name: 'Bakery', count: '120+ items' },
  { emoji: '🥦', name: 'Produce', count: '85+ items' },
  { emoji: '🍲', name: 'Cooked Meals', count: '60+ items' },
  { emoji: '🥫', name: 'Non-Perishable', count: '200+ items' },
  { emoji: '🧀', name: 'Dairy', count: '45+ items' },
  { emoji: '🥤', name: 'Beverages', count: '30+ items' },
]

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary-50 via-white to-accent-50 pt-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-primary-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent-200 rounded-full opacity-20 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Leaf size={14} /> Fighting Hunger, Reducing Waste
              </motion.div>
              <motion.h1 variants={fadeUp} className="font-display text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Every Meal <span className="text-primary-600">Matters</span>,<br />Every Share <span className="text-accent-500">Saves</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
                Connect surplus food with people who need it. Join thousands of donors, volunteers, and recipients making a real difference in their communities.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
                  Get Started <ArrowRight size={18} />
                </Link>
                <Link to="/donations" className="btn-secondary text-base px-8 py-3">
                  Browse Food
                </Link>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-8 flex items-center gap-6">
                {[{ icon: CheckCircle, text: 'Free to use' }, { icon: ShieldCheck, text: 'Safe & trusted' }, { icon: Zap, text: 'Quick & easy' }].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-gray-600"><Icon size={16} className="text-primary-500" /> {text}</div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero visual */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="relative">
              <div className="relative bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {['🍞 Bread Loaves', '🥦 Fresh Vegetables', '🍲 Hot Meals', '🥫 Canned Goods'].map((item, i) => (
                    <motion.div key={item} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                      className="bg-gray-50 rounded-2xl p-4 text-center">
                      <div className="text-3xl mb-1">{item.split(' ')[0]}</div>
                      <p className="text-xs font-medium text-gray-600">{item.split(' ').slice(1).join(' ')}</p>
                      <span className="text-xs text-primary-600 font-semibold">Available</span>
                    </motion.div>
                  ))}
                </div>
                <div className="bg-primary-600 rounded-2xl p-4 text-white text-center">
                  <p className="text-sm font-medium opacity-90">Latest Impact Today</p>
                  <p className="text-3xl font-display font-bold">47 Meals</p>
                  <p className="text-sm opacity-80">shared in your city</p>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-lg p-3 border border-gray-100">
                <div className="flex items-center gap-2"><span className="text-2xl">🎉</span><div><p className="text-xs font-semibold text-gray-900">Claimed!</p><p className="text-xs text-gray-500">Just now</p></div></div>
              </motion.div>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3.5 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-3 border border-gray-100">
                <div className="flex items-center gap-2"><span className="text-2xl">🚴</span><div><p className="text-xs font-semibold text-gray-900">On the way!</p><p className="text-xs text-gray-500">Volunteer assigned</p></div></div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-gray-50">
                <p className={`text-4xl font-display font-bold ${s.color}`}>{s.value}</p>
                <p className="text-gray-600 mt-1 text-sm">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="section-title mt-2">Simple Steps to <span className="text-primary-600">Make a Difference</span></h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Our platform makes food donation effortless. From posting surplus to delivering hope — it takes minutes.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="card text-center relative">
                <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <step.icon size={24} />
                </div>
                <div className="absolute top-4 right-4 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-500">{i + 1}</div>
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="section-title">Browse by <span className="text-accent-500">Category</span></h2>
            <p className="text-gray-500 mt-3">Find the food you need or donate what you have</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <Link to={`/donations?category=${cat.name}`}
                  className="card text-center hover:shadow-card-hover hover:-translate-y-1 transition-all group">
                  <div className="text-4xl mb-2">{cat.emoji}</div>
                  <p className="font-semibold text-gray-800 text-sm group-hover:text-primary-600 transition-colors">{cat.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{cat.count}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-3">Stories That <span className="text-primary-200">Inspire</span></h2>
            <p className="text-primary-200">Real people, real impact</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex gap-0.5 mb-4">{Array(t.rating).fill(0).map((_, j) => <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />)}</div>
                <p className="text-white/90 leading-relaxed mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-primary-200 text-sm">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-5xl mb-6">🌱</div>
            <h2 className="section-title mb-4">Ready to Make a <span className="text-primary-600">Difference</span>?</h2>
            <p className="text-gray-500 text-lg mb-8">Join our growing community and help us build a world where no food goes to waste and no one goes hungry.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register" className="btn-primary text-base px-10 py-3">Start Donating</Link>
              <Link to="/register" className="btn-secondary text-base px-10 py-3">Volunteer Today</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
