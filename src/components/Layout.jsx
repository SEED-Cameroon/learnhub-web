import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from './footer/Footer'

function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center gap-6">
        <Link to="/" className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          LearnHub
        </Link>

        <nav className="flex gap-4 text-sm">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/mentors" className="hover:underline">Tutors</Link>

          {user && (
            <>
              <Link to="/courses" className="hover:underline">Courses</Link>
              <Link to="/account" className="hover:underline">Account</Link>
            </>
          )}

          {user?.role === 'tutor' && (
            <Link to="/dashboard" className="hover:underline font-medium text-blue-600">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-slate-600">
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm hover:underline">Login</Link>
              <Link
                to="/register"
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Layout