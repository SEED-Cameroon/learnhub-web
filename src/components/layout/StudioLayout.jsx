import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BookHeart, ExternalLink, LayoutDashboard, LibraryBig, LogOut, Menu, Settings, UserRoundPen, Wallet } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import Avatar from '@/components/common/Avatar'

// Tutor creator-studio shell (Frontend SRS §2.2): sidebar in place of the public navbar.
const STUDIO_LINKS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/courses', label: 'My courses', icon: LibraryBig },
  { to: '/dashboard/earnings', label: 'Earnings', icon: Wallet },
  { to: '/dashboard/profile', label: 'Public profile', icon: UserRoundPen },
  { to: '/account/settings', label: 'Settings', icon: Settings },
]

const linkClass = ({ isActive }) =>
  isActive
    ? 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold bg-primary-container text-on-primary'
    : 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors'

function StudioNav({ onNavigate }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const Wrap = onNavigate ? SheetClose : ({ children }) => children

  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2 px-3 pt-1 pb-6 text-lg font-bold text-primary">
        <BookHeart className="size-6 text-secondary-container" strokeWidth={2.25} aria-hidden="true" />
        LearnHub Studio
      </Link>

      <nav aria-label="Studio" className="flex flex-col gap-1">
        {STUDIO_LINKS.map(({ to, label, icon: Icon, end }) => (
          <Wrap key={to} asChild>
            <NavLink to={to} end={end} className={linkClass}>
              <Icon className="size-[18px]" aria-hidden="true" />
              {label}
            </NavLink>
          </Wrap>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-outline-variant pt-4">
        {user && (
          <Wrap asChild>
            <Link to={`/tutors/${user.id}`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container">
              <ExternalLink className="size-[18px]" aria-hidden="true" />
              View public page
            </Link>
          </Wrap>
        )}
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar name={user?.name} src={user?.avatarUrl} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-on-surface">{user?.name}</p>
            <p className="truncate text-xs text-on-surface-variant">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Log out"
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            <LogOut />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function StudioLayout() {
  return (
    <div className="min-h-screen bg-surface md:grid md:grid-cols-[256px_1fr]">
      <aside className="hidden border-r border-outline-variant bg-surface-container-low md:block">
        <div className="sticky top-0 h-screen px-3 py-5">
          <StudioNav />
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-outline-variant bg-surface/95 px-4 py-3 backdrop-blur md:hidden">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-primary">
          <BookHeart className="size-6 text-secondary-container" strokeWidth={2.25} aria-hidden="true" />
          LearnHub Studio
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open studio menu">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-4/5 bg-surface-container-low px-3 py-5 sm:max-w-xs">
            <SheetTitle className="sr-only">Studio menu</SheetTitle>
            <StudioNav onNavigate />
          </SheetContent>
        </Sheet>
      </header>

      <main id="main" className="min-w-0 px-4 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-[1120px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
