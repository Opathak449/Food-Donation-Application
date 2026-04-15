import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Menu, X, Bell, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../features/auth/AuthContext'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/donations', label: 'Browse Food' },
  { to: '/contact', label: 'Contact' },
]

const roleColors = { donor: 'bg-primary-100 text-primary-700', recipient: 'bg-blue-100 text-blue-700', volunteer: 'bg-purple-100 text-purple-700', admin: 'bg-red-100 text-red-700' }
const dashboardPath = { donor: '/donor/dashboard', recipient: '/recipient/dashboard', volunteer: '/volunteer/dashboard', admin: '/admin/dashboard' }

export default function PublicLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center group-hover:bg-primary-700 transition-colors">
                <Heart size={18} className="text-white fill-white" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900">Food<span className="text-primary-600">Share</span></span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.to ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link to="/notifications" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"><Bell size={18} /></Link>
                  <div className="relative">
                    <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user.full_name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{user.full_name?.split(' ')[0]}</span>
                      <span className={`badge ${roleColors[user.role]}`}>{user.role}</span>
                      <ChevronDown size={14} className="text-gray-500" />
                    </button>
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                          className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                          <Link to={dashboardPath[user.role]} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><LayoutDashboard size={15} /> Dashboard</Link>
                          <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><User size={15} /> Profile</Link>
                          <hr className="my-1 border-gray-100" />
                          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"><LogOut size={15} /> Logout</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary py-2 text-sm">Login</Link>
                  <Link to="/register" className="btn-primary py-2 text-sm">Join Now</Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">{link.label}</Link>
              ))}
              <hr className="my-2" />
              {user ? (
                <>
                  <Link to={dashboardPath[user.role]} className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                  <Link to="/profile" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50">Logout</button>
                </>
              ) : (
                <div className="flex gap-2 pt-1">
                  <Link to="/login" className="btn-secondary flex-1 text-center text-sm py-2">Login</Link>
                  <Link to="/register" className="btn-primary flex-1 text-center text-sm py-2">Register</Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Heart size={15} className="text-white fill-white" />
                </div>
                <span className="font-display font-bold text-white text-lg">FoodShare</span>
              </div>
              <p className="text-sm leading-relaxed">Reducing food waste and fighting hunger by connecting donors, recipients, and volunteers across communities.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Platform</h4>
              <div className="space-y-2 text-sm">
                <Link to="/donations" className="block hover:text-white transition-colors">Browse Donations</Link>
                <Link to="/how-it-works" className="block hover:text-white transition-colors">How It Works</Link>
                <Link to="/register" className="block hover:text-white transition-colors">Join as Donor</Link>
                <Link to="/register" className="block hover:text-white transition-colors">Volunteer</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">About</h4>
              <div className="space-y-2 text-sm">
                <Link to="/about" className="block hover:text-white transition-colors">Our Mission</Link>
                <Link to="/faq" className="block hover:text-white transition-colors">FAQ</Link>
                <Link to="/contact" className="block hover:text-white transition-colors">Contact Us</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Impact</h4>
              <div className="space-y-1 text-sm">
                <p className="text-2xl font-display font-bold text-primary-400">10,000+</p>
                <p>Meals Donated</p>
                <p className="text-2xl font-display font-bold text-accent-400 mt-3">500+</p>
                <p>Volunteers Active</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm">© 2024 FoodShare. Built to reduce waste and feed hope.</p>
            <p className="text-sm flex items-center gap-1">Made with <Heart size={13} className="text-red-500 fill-red-500" /> for communities everywhere</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
