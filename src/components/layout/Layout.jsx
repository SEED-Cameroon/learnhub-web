import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetClose } from '@/components/ui/sheet'
import MaterialIcon from '@/components/icons/MaterialIcon'
import Footer from './Footer'

const NAV_LINKS = [
  { to: '/courses', label: 'Courses' },
  { to: '/tutors', label: 'Tutors' },
  { to: '/about', label: 'About' },
]

const desktopNavLinkClass = ({ isActive }) =>
  isActive
    ? 'text-primary font-bold border-b-2 border-primary pb-1'
    : 'text-on-surface-variant hover:text-primary transition-colors'

const mobileNavLinkClass = ({ isActive }) =>
  isActive
    ? 'block rounded-lg px-3 py-2.5 text-base font-bold text-primary bg-primary-container/10'
    : 'block rounded-lg px-3 py-2.5 text-base text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors'

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
      <header className="bg-surface shadow-sm sticky top-0 z-50 px-4 md:px-10 py-4">
        <div className="flex items-center justify-between gap-4 md:grid md:grid-cols-[auto_1fr_auto]">
          <Link to="/" className="text-2xl font-bold text-primary whitespace-nowrap">
            LearnHub Cameroon
          </Link>

          <nav className="hidden md:flex justify-center gap-8 text-base">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={desktopNavLinkClass}>
                {link.label}
              </NavLink>
            ))}

            {user && (
              <Link to="/account" className="hover:text-primary transition-colors">
                Account
              </Link>
            )}

            {user?.role === 'tutor' && (
              <Link to="/dashboard" className="font-medium text-primary hover:underline">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-4 justify-self-end">
            {user ? (
              <>
                <span className="text-sm text-on-surface-variant whitespace-nowrap">
                  {user.name} ({user.role})
                </span>
                <Button
                  variant="link"
                  onClick={handleLogout}
                  className="h-auto p-0 text-sm text-destructive whitespace-nowrap"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-base font-bold text-on-surface-variant hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Button
                  asChild
                  className="h-auto text-sm px-6 py-2.5 rounded-full hover:opacity-90 hover:bg-primary shadow-none whitespace-nowrap"
                >
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile nav trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <MaterialIcon name="menu" className="text-2xl" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-4/5 sm:max-w-xs p-0">
              <SheetTitle asChild>
                <Link to="/" className="text-xl font-bold text-primary px-4 pt-6 pb-2">
                  LearnHub Cameroon
                </Link>
              </SheetTitle>

              <nav className="flex flex-col gap-1 px-2 mt-2">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.to}>
                    <NavLink to={link.to} className={mobileNavLinkClass}>
                      {link.label}
                    </NavLink>
                  </SheetClose>
                ))}

                {user && (
                  <SheetClose asChild>
                    <NavLink to="/account" className={mobileNavLinkClass}>
                      Account
                    </NavLink>
                  </SheetClose>
                )}

                {user?.role === 'tutor' && (
                  <SheetClose asChild>
                    <NavLink to="/dashboard" className={mobileNavLinkClass}>
                      Dashboard
                    </NavLink>
                  </SheetClose>
                )}
              </nav>

              <div className="mt-auto flex flex-col gap-3 px-4 pb-6 pt-4 border-t border-outline-variant">
                {user ? (
                  <>
                    <span className="text-sm text-on-surface-variant">
                      {user.name} ({user.role})
                    </span>
                    <SheetClose asChild>
                      <Button
                        variant="link"
                        onClick={handleLogout}
                        className="h-auto p-0 justify-start text-sm text-destructive"
                      >
                        Logout
                      </Button>
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link to="/login" className="text-base font-bold text-on-surface-variant hover:text-primary">
                        Login
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild className="h-auto text-sm px-6 py-2.5 rounded-full shadow-none">
                        <Link to="/register">Sign Up</Link>
                      </Button>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
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
