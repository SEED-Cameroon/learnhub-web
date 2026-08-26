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
        <Link
          to="/"
          className="text-xl font-bold text-[#123263] dark:text-slate-100"
        >
          LearnHub Cameroon
        </Link>

        <nav className="flex gap-6 text-sm text-slate-600 dark:text-slate-300">
          <Link to="/courses" className="hover:text-[#123263] dark:hover:text-white">Courses</Link>
          <Link to="/mentors" className="hover:text-[#123263] dark:hover:text-white">Tutors</Link>
          <a href="/#why" className="hover:text-[#123263] dark:hover:text-white">About</a>

          {user && (
            <Link to="/account" className="hover:text-[#123263] dark:hover:text-white">Account</Link>
          )}

          {user?.role === 'tutor' && (
            <Link to="/dashboard" className="font-medium text-[#123263] dark:text-white hover:underline">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-slate-600 dark:text-slate-300">
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
              <Link to="/login" className="text-sm font-semibold text-slate-800 dark:text-slate-100 hover:underline">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-[#123263] text-white px-5 py-2 rounded-full hover:bg-[#0d2549] transition"
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