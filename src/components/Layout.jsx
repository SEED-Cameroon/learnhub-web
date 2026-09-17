import { Link, NavLink, Outlet } from 'react-router-dom'

function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbfcff]">
      <header className="border-b border-slate-200 bg-white px-6 py-4 sm:px-10 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="text-base font-bold text-blue-950 sm:text-lg">LearnHub Cameroon</Link>
          <nav className="hidden items-center gap-7 text-xs text-slate-500 sm:flex" aria-label="Primary navigation">
            <NavLink to="/" className="hover:text-blue-900">Courses</NavLink>
            <NavLink to="/tutors" className={({ isActive }) => isActive ? "border-b-2 border-blue-900 pb-2 font-semibold text-blue-900" : "hover:text-blue-900"}>Tutors</NavLink>
            <a href="#about" className="hover:text-blue-900">About</a>
          </nav>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/login" className="font-medium text-slate-600 hover:text-blue-900">Login</Link>
            <Link to="/signup" className="rounded-full bg-blue-900 px-5 py-2.5 font-semibold text-white hover:bg-blue-800">Sign Up</Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children ?? <Outlet />}</main>
      <footer id="about" className="border-t border-blue-300 bg-white px-6 py-8 sm:px-10 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 text-xs text-slate-500 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-base font-bold text-blue-950">LearnHub Cameroon</p>
            <p className="mt-4 max-w-xs leading-5">© 2024 LearnHub Cameroon. Empowering local tutors and students.</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Footer navigation">
            <Link to="/">Courses</Link>
            <Link to="/tutors">Tutors</Link>
            <a href="#about">Support</a>
            <a href="#about">Privacy Policy</a>
            <a href="#about">Terms of Service</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}

export default Layout
