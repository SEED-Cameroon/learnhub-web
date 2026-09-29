import { startTransition, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authApi } from '@/services/api'
import { USE_MOCKS } from '@/services/mock'
import { homeFor } from '@/components/auth/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

const FIELD =
  'h-auto rounded-lg border-outline-variant py-3 pl-10 pr-3 focus-visible:border-primary focus-visible:ring-primary'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from
  const pendingAction = location.state?.pendingAction

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Expected API response: { token, user: { id, name, email, role: "student" | "tutor" } }
      const data = await authApi.login({ email, password })
      // React Router applies navigation as a transition. Setting the user in the same transition renders both
      // together; otherwise GuestOnly sees the user first and redirects to the role home instead of `from`.
      if (from) {
        // Back to the page that asked for login, finishing the action the guest started there.
        navigate(from, { replace: true, state: pendingAction ? { pendingAction } : null })
      } else {
        navigate(homeFor(data.user), { replace: true })
      }
      startTransition(() => login(data.user, data.token))
    } catch (err) {
      setError(
        err?.status === 401 || !err?.message
          ? 'That email and password don’t match. Check them and try again.'
          : err.message,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <Card className="relative overflow-hidden rounded-xl border-surface-variant py-0 shadow-[0px_12px_32px_rgba(0,0,0,0.08)]">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-tertiary" />

        <CardContent className="p-6 sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-[28px] font-bold leading-9 text-primary">Log in</h1>
            <p className="mt-2 text-base text-on-surface-variant">
              {from ? 'Log in to continue where you left off.' : 'Welcome back. Enter your details to continue.'}
            </p>
          </div>

          {error && (
            <div role="alert" className="mb-6 rounded-lg bg-error-container p-3 text-sm text-on-error-container">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-on-surface">
                Email
              </Label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-on-surface-variant"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={FIELD}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-semibold text-on-surface">
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-on-surface-variant"
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className={FIELD}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-auto w-full rounded-full py-3 text-sm shadow-sm hover:bg-primary-container hover:shadow-md"
            >
              {loading ? 'Logging in…' : 'Log in'}
            </Button>
          </form>

          {USE_MOCKS && (
            <p className="mt-6 rounded-lg bg-surface-container-low p-3 text-xs text-on-surface-variant">
              Sample mode: any email and password work. Use an email with “tutor” in it to open the tutor studio.
            </p>
          )}

          <p className="mt-8 text-center text-sm text-on-surface-variant">
            Don’t have an account?{' '}
            <Link
              to="/register"
              state={location.state}
              className="font-semibold text-secondary underline-offset-4 transition-colors hover:text-secondary-container hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
