import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './features/auth/AuthContext'

// Layouts
import PublicLayout from './components/layout/PublicLayout'
import DashboardLayout from './components/layout/DashboardLayout'

// Public Pages
import Home from './pages/Home'
import About from './pages/About'
import HowItWorks from './pages/HowItWorks'
import BrowseDonations from './pages/BrowseDonations'
import DonationDetail from './pages/DonationDetail'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

// Auth Pages
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'

// Donor Pages
import DonorDashboard from './pages/donor/Dashboard'
import NewDonation from './pages/donor/NewDonation'
import MyDonations from './pages/donor/MyDonations'
import EditDonation from './pages/donor/EditDonation'

// Recipient Pages
import RecipientDashboard from './pages/recipient/Dashboard'
import MyClaims from './pages/recipient/MyClaims'
import MyRequests from './pages/recipient/MyRequests'
import RequestFood from './pages/recipient/RequestFood'

// Volunteer Pages
import VolunteerDashboard from './pages/volunteer/Dashboard'
import AvailableTasks from './pages/volunteer/AvailableTasks'
import MyTasks from './pages/volunteer/MyTasks'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageDonations from './pages/admin/ManageDonations'
import ManageRequests from './pages/admin/ManageRequests'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/donations" element={<BrowseDonations />} />
        <Route path="/donations/:id" element={<DonationDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/login" element={user ? <Navigate to={getDashboard(user.role)} /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={getDashboard(user.role)} /> : <Register />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Donor */}
        <Route path="/donor/dashboard" element={<ProtectedRoute roles={['donor']}><DonorDashboard /></ProtectedRoute>} />
        <Route path="/donor/new-donation" element={<ProtectedRoute roles={['donor']}><NewDonation /></ProtectedRoute>} />
        <Route path="/donor/my-donations" element={<ProtectedRoute roles={['donor']}><MyDonations /></ProtectedRoute>} />
        <Route path="/donor/edit/:id" element={<ProtectedRoute roles={['donor']}><EditDonation /></ProtectedRoute>} />

        {/* Recipient */}
        <Route path="/recipient/dashboard" element={<ProtectedRoute roles={['recipient']}><RecipientDashboard /></ProtectedRoute>} />
        <Route path="/recipient/my-claims" element={<ProtectedRoute roles={['recipient']}><MyClaims /></ProtectedRoute>} />
        <Route path="/recipient/my-requests" element={<ProtectedRoute roles={['recipient']}><MyRequests /></ProtectedRoute>} />
        <Route path="/recipient/request-food" element={<ProtectedRoute roles={['recipient']}><RequestFood /></ProtectedRoute>} />

        {/* Volunteer */}
        <Route path="/volunteer/dashboard" element={<ProtectedRoute roles={['volunteer']}><VolunteerDashboard /></ProtectedRoute>} />
        <Route path="/volunteer/tasks" element={<ProtectedRoute roles={['volunteer']}><AvailableTasks /></ProtectedRoute>} />
        <Route path="/volunteer/my-tasks" element={<ProtectedRoute roles={['volunteer']}><MyTasks /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/donations" element={<ProtectedRoute roles={['admin']}><ManageDonations /></ProtectedRoute>} />
        <Route path="/admin/requests" element={<ProtectedRoute roles={['admin']}><ManageRequests /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function getDashboard(role) {
  const map = { donor: '/donor/dashboard', recipient: '/recipient/dashboard', volunteer: '/volunteer/dashboard', admin: '/admin/dashboard' }
  return map[role] || '/'
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
