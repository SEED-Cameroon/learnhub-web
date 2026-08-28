import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../services/api'
import { ApiError } from '../services/apiClient'
import MaterialIcon from '../components/icons/MaterialIcon'

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await authApi.register(form)

      // Auto-login after successful registration
      login(data.user, data.token)

      // Redirect based on role
      if (data.user.role === 'tutor') {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/courses', { replace: true })
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Registration failed. Email may already be in use.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden px-4 py-16">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-fixed rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary-fixed rounded-full opacity-30 blur-3xl" />
      </div>

      <main className="w-full max-w-md z-10 relative">
        <div className="text-center mb-8">
          <Link to="/" className="text-[32px] leading-10 font-bold text-primary tracking-tight hover:opacity-80 transition-opacity">
            LearnHub Cameroon
          </Link>
          <p className="mt-2 text-base text-on-surface-variant">Join the learning community</p>
        </div>

        <div className="bg-surface-container-lowest/80 backdrop-blur-lg border border-white/30 rounded-xl shadow-[0_8px_32px_0_rgba(0,35,111,0.05)] p-8">
          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role toggle */}
            <div className="flex items-center justify-center bg-surface-container-low p-1 rounded-full">
              <label className="cursor-pointer relative w-1/2 text-center">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={form.role === 'student'}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <span className="block py-2 px-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 peer-checked:bg-primary peer-checked:text-on-primary text-on-surface-variant hover:text-primary">
                  I am a Student
                </span>
              </label>
              <label className="cursor-pointer relative w-1/2 text-center">
                <input
                  type="radio"
                  name="role"
                  value="tutor"
                  checked={form.role === 'tutor'}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <span className="block py-2 px-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 peer-checked:bg-secondary peer-checked:text-on-secondary text-on-surface-variant hover:text-secondary">
                  I am a Tutor
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold tracking-wide text-on-surface mb-1" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                    <MaterialIcon name="person" />
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-3 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-on-surface-variant/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold tracking-wide text-on-surface mb-1" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                    <MaterialIcon name="mail" />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
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
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                    <MaterialIcon name="lock" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-on-surface-variant/50"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary text-on-primary rounded-full text-sm font-semibold tracking-wide hover:bg-primary-container hover:shadow-md transition-all duration-150 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              {!loading && (
                <MaterialIcon name="arrow_forward" className="group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
