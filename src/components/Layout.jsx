import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
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
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Header */}
      <header className="bg-surface shadow-sm sticky top-0 z-50 px-4 md:px-10 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-6">
        <Link
          to="/"
          className="text-2xl font-bold text-primary whitespace-nowrap"
        >
          LearnHub Cameroon
        </Link>

        <nav className="flex justify-center gap-8 text-base">
          <NavLink
            to="/courses"
            className={({ isActive }) =>
              isActive
                ? 'text-primary font-bold border-b-2 border-primary pb-1'
                : 'text-on-surface-variant hover:text-primary transition-colors'
            }
          >
            Courses
          </NavLink>
          <NavLink
            to="/mentors"
            className={({ isActive }) =>
              isActive
                ? 'text-primary font-bold border-b-2 border-primary pb-1'
                : 'text-on-surface-variant hover:text-primary transition-colors'
            }
          >
            Tutors
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? 'text-primary font-bold border-b-2 border-primary pb-1'
                : 'text-on-surface-variant hover:text-primary transition-colors'
            }
          >
            About
          </NavLink>

          {user && (
            <Link to="/account" className="hover:text-primary transition-colors">Account</Link>
          )}

          {user?.role === 'tutor' && (
            <Link to="/dashboard" className="font-medium text-primary hover:underline">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4 justify-self-end">
          {user ? (
            <>
              <span className="text-sm text-on-surface-variant whitespace-nowrap">
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:underline whitespace-nowrap"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:block text-base font-bold text-on-surface-variant hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-primary text-on-primary px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Sign Up
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