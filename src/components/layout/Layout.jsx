import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { LogoMark } from '@/components/brand/Logo'
import { CreditCard, LayoutDashboard, LogOut, Menu, Settings, UserRound } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetClose } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Avatar from '@/components/common/Avatar'
import Footer from './Footer'

const NAV_LINKS = [
  { to: '/courses', label: 'Courses' },
  { to: '/tutors', label: 'Tutors' },
  { to: '/about', label: 'About' },
]

const desktopNavLinkClass = ({ isActive }) =>
  isActive
    ? 'text-primary font-bold border-b-2 border-primary pb-1'
    : 'text-on-surface-variant hover:text-primary transition-colors pb-1 border-b-2 border-transparent'

const mobileNavLinkClass = ({ isActive }) =>
  isActive
    ? 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-bold text-primary bg-primary-container/10'
    : 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-base text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors'

function accountLinks(user) {
  if (user?.role === 'tutor') {
    return [
      { to: '/dashboard', label: 'Tutor studio', icon: LayoutDashboard },
      { to: '/account', label: 'My account', icon: UserRound },
      { to: '/account/settings', label: 'Settings', icon: Settings },
    ]
  }
  return [
    { to: '/account', label: 'My account', icon: UserRound },
    { to: '/account/subscriptions', label: 'My subscriptions', icon: CreditCard },
    { to: '/account/settings', label: 'Settings', icon: Settings },
  ]
}

function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary">
        Skip to content
      </a>

      <header className="bg-surface/95 backdrop-blur shadow-sm sticky top-0 z-50 px-4 md:px-10 py-3">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 md:grid md:grid-cols-[auto_1fr_auto]">
          <Link to="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-primary whitespace-nowrap">
            <LogoMark className="size-8" />
            LearnHub Cameroon
          </Link>

          <nav aria-label="Main" className="hidden md:flex justify-center gap-8 text-base">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={desktopNavLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4 justify-self-end">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-primary">
                  <Avatar name={user.name} src={user.avatarUrl} size="sm" />
                  <span className="max-w-40 truncate text-sm font-semibold text-on-surface">{user.name}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <p className="text-sm font-semibold text-on-surface">{user.name}</p>
                    <p className="text-xs text-on-surface-variant">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {accountLinks(user).map(({ to, label, icon: Icon }) => (
                    <DropdownMenuItem key={to} onSelect={() => navigate(to)}>
                      <Icon aria-hidden="true" />
                      {label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout}>
                    <LogOut aria-hidden="true" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-base font-bold text-on-surface-variant hover:text-primary transition-colors"
                >
                  Log in
                </Link>
                <Button
                  asChild
                  className="h-auto text-sm px-6 py-2.5 rounded-full hover:opacity-90 hover:bg-primary shadow-none whitespace-nowrap"
                >
                  <Link to="/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile nav */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-4/5 sm:max-w-xs p-0">
              <SheetTitle asChild>
                <Link to="/" className="text-xl font-bold text-primary px-4 pt-6 pb-2">
                  LearnHub Cameroon
                </Link>
              </SheetTitle>

              <nav aria-label="Main" className="flex flex-col gap-1 px-2 mt-2">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.to}>
                    <NavLink to={link.to} className={mobileNavLinkClass}>
                      {link.label}
                    </NavLink>
                  </SheetClose>
                ))}
              </nav>

              {user && (
                <nav aria-label="Account" className="flex flex-col gap-1 px-2 border-t border-outline-variant pt-3">
                  {accountLinks(user).map(({ to, label, icon: Icon }) => (
                    <SheetClose asChild key={to}>
                      <NavLink to={to} end className={mobileNavLinkClass}>
                        <Icon className="size-5" aria-hidden="true" />
                        {label}
                      </NavLink>
                    </SheetClose>
                  ))}
                </nav>
              )}

              <div className="mt-auto flex flex-col gap-3 px-4 pb-6 pt-4 border-t border-outline-variant">
                {user ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} src={user.avatarUrl} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-on-surface">{user.name}</p>
                        <p className="truncate text-xs text-on-surface-variant">{user.email}</p>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <Button variant="outline" onClick={handleLogout} className="rounded-full">
                        <LogOut aria-hidden="true" />
                        Log out
                      </Button>
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Button asChild variant="outline" className="h-auto py-2.5 rounded-full">
                        <Link to="/login">Log in</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild className="h-auto py-2.5 rounded-full shadow-none">
                        <Link to="/register">Sign up</Link>
                      </Button>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Layout
