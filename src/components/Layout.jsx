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
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-[#f8f8ff] px-8 py-6 grid grid-cols-[auto_1fr_auto] items-center gap-6">
        <Link
          to="/"
          className="text-2xl font-bold text-[#123263] whitespace-nowrap"
        >
          LearnHub Cameroon
        </Link>

        <nav className="flex justify-center gap-10 text-base text-slate-600">
          <Link to="/courses" className="hover:text-[#123263]">Courses</Link>
          <Link to="/mentors" className="hover:text-[#123263]">Tutors</Link>
          <a href="/#why" className="hover:text-[#123263]">About</a>

          {user && (
            <Link to="/account" className="hover:text-[#123263]">Account</Link>
          )}

          {user?.role === 'tutor' && (
            <Link to="/dashboard" className="font-medium text-[#123263] hover:underline">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-6 justify-self-end">
          {user ? (
            <>
              <span className="text-sm text-slate-600 whitespace-nowrap">
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
              <Link to="/login" className="text-base font-bold text-slate-900 hover:text-[#123263]">
                Login
              </Link>
              <Link
                to="/register"
                className="text-base font-medium bg-[#123263] text-white px-7 py-2.5 rounded-full hover:bg-[#0d2549] transition whitespace-nowrap"
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