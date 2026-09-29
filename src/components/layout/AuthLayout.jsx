import { Link, Outlet, useLocation } from 'react-router-dom'
import { LogoMark } from '@/components/brand/Logo'
import AuthAside from '@/components/auth/AuthAside'

// Split shell for Login / Signup: a focused form on the left, and on wide
// screens a panel explaining what the account is for.
export default function AuthLayout() {
  const location = useLocation()
  const onLogin = location.pathname === '/login'

  return (
    <div className="min-h-screen bg-surface lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex min-h-screen flex-col px-4 py-5 sm:px-8 md:px-12">
        <header className="flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold text-primary sm:text-xl">
            <LogoMark className="size-8" />
            LearnHub Cameroon
          </Link>
          <p className="hidden text-sm text-on-surface-variant sm:block">
            {onLogin ? 'New to LearnHub? ' : 'Have an account? '}
            <Link
              to={onLogin ? '/register' : '/login'}
              state={location.state}
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              {onLogin ? 'Sign up' : 'Log in'}
            </Link>
          </p>
        </header>

        <main id="main" className="flex flex-1 items-start justify-center py-10 sm:items-center">
          <div className="w-full max-w-[420px]">
            <Outlet />
          </div>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant">
          <span>© {new Date().getFullYear()} LearnHub Cameroon</span>
          <Link to="/courses" className="hover:text-primary">
            Browse courses without an account
          </Link>
        </footer>
      </div>

      <AuthAside />
    </div>
  )
}
