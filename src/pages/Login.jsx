import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { authApi } from '@/services/api'
import { ApiError } from '@/services/apiClient'
import MaterialIcon from '@/components/icons/MaterialIcon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Expected API response:
      // { token: "...", user: { id, name, email, role: "student" | "tutor" } }
      const data = await authApi.login({ email, password })

      login(data.user, data.token)

      // Redirect based on role (Acceptance Criteria)
      if (data.user.role === 'tutor') {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/courses', { replace: true })
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden px-4 py-16">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-fixed-dim rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-fixed rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-tertiary-fixed rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <main className="w-full max-w-md z-10 relative">
        <Card className="rounded-xl shadow-[0px_12px_32px_rgba(0,0,0,0.1)] relative overflow-hidden border-surface-variant py-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary" />

          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Link to="/" className="text-[32px] leading-10 font-bold text-primary hover:text-primary-container transition-colors">
                LearnHub Cameroon
              </Link>
              <p className="mt-2 text-base text-on-surface-variant">
                Welcome back. Please enter your details.
              </p>
            </div>

            {error && (
              <div role="alert" className="bg-error-container text-on-error-container p-3 rounded mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-semibold tracking-wide text-on-surface">
                  Email
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
                    <MaterialIcon name="mail" />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-auto pl-10 pr-3 py-3 rounded-lg border-outline-variant focus-visible:border-primary focus-visible:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm font-semibold tracking-wide text-on-surface">
                  Password
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
                    <MaterialIcon name="lock" />
                  </span>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-auto pl-10 pr-3 py-3 rounded-lg border-outline-variant focus-visible:border-primary focus-visible:ring-primary"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-auto text-sm tracking-wide py-3 rounded-full shadow-sm hover:shadow-md hover:bg-primary-container group"
              >
                <span>{loading ? 'Logging in...' : 'Login'}</span>
                {!loading && (
                  <MaterialIcon name="arrow_forward" className="group-hover:translate-x-1 transition-transform" />
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-on-surface-variant">
                Don&apos;t have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-secondary hover:text-secondary-container transition-colors underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
