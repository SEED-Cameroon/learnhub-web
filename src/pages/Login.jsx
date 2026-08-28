import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../services/api'
import { ApiError } from '../services/apiClient'
import MaterialIcon from '../components/icons/MaterialIcon'

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
        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(0,0,0,0.1)] p-8 relative overflow-hidden border border-surface-variant">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary" />

          <div className="text-center mb-8">
            <Link to="/" className="text-[32px] leading-10 font-bold text-primary hover:text-primary-container transition-colors">
              LearnHub Cameroon
            </Link>
            <p className="mt-2 text-base text-on-surface-variant">
              Welcome back. Please enter your details.
            </p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold tracking-wide text-on-surface mb-1" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
                  <MaterialIcon name="mail" />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-on-surface-variant/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold tracking-wide text-on-surface mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
                  <MaterialIcon name="lock" />
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-on-surface-variant/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary text-sm font-semibold tracking-wide py-3 rounded-full hover:bg-primary-container transition-colors shadow-sm hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              <span>{loading ? 'Logging in...' : 'Login'}</span>
              {!loading && (
                <MaterialIcon name="arrow_forward" className="group-hover:translate-x-1 transition-transform" />
              )}
            </button>
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
        </div>
      </main>
    </div>
  )
}
