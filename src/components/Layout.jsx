import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Layout() {
  const { user, logout } = useAuth();

  const navClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-blue-600"
        : "text-slate-600 hover:text-blue-600"
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-slate-900"
            >
              LearnHub
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <NavLink to="/courses" className={navClass}>
                Courses
              </NavLink>

              <NavLink to="/tutors" className={navClass}>
                Tutors
              </NavLink>

              <NavLink to="/about" className={navClass}>
                About
              </NavLink>

              {user ? (
                <>
                  <NavLink
                    to={user.role === "tutor" ? "/dashboard" : "/account"}
                    className={navClass}
                  >
                    My Account
                  </NavLink>

                  <button
                    type="button"
                    onClick={logout}
                    className="text-sm font-medium text-slate-600 transition hover:text-red-600"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={navClass}>
                    Login
                  </NavLink>

                  <Link
                    to="/signup"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </nav>

            <div className="md:hidden">
              {user ? (
                <Link
                  to={user.role === "tutor" ? "/dashboard" : "/account"}
                  className="text-sm font-semibold text-blue-600"
                >
                  My Account
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-semibold text-blue-600"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          <nav className="mt-4 flex gap-5 overflow-x-auto border-t border-slate-100 pt-4 md:hidden">
            <NavLink to="/courses" className={navClass}>
              Courses
            </NavLink>

            <NavLink to="/tutors" className={navClass}>
              Tutors
            </NavLink>

            <NavLink to="/about" className={navClass}>
              About
            </NavLink>

            {user && (
              <button
                type="button"
                onClick={logout}
                className="whitespace-nowrap text-sm font-medium text-slate-600 hover:text-red-600"
              >
                Log out
              </button>
            )}
          </nav>
        </div>
      </header>

      <Outlet />
    </div>
  );
}

export default Layout;