import { startTransition, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authApi } from '@/services/api'
import { USE_MOCKS } from '@/services/mock'
import { homeFor } from '@/components/auth/ProtectedRoute'
import { AuthBanner, AuthField, PasswordInput, Spinner } from '@/components/auth/AuthField'
import { Button } from '@/components/ui/button'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Why a guest was sent here, from the gated action they tried (Frontend SRS §4.3).
const REASONS = {
  like: 'Log in to like this course. We’ll bring you straight back.',
  follow: 'Log in to follow this tutor. We’ll bring you straight back.',
  comment: 'Log in to join the discussion. We’ll bring you straight back.',
}

function validate({ email, password }) {
  const errors = {}
  if (!email.trim()) errors.email = 'Enter your email address.'
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter an email like name@example.com.'
  if (!password) errors.password = 'Enter your password.'
  return errors
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from
  const pendingAction = location.state?.pendingAction
  const reason = REASONS[pendingAction?.type] ?? (from ? 'Log in to continue where you left off.' : '')

  const handleChange = (e) => {
    const { name, value } = e.target
    const next = { ...form, [name]: value }
    setForm(next)
    setServerError('')
    // Once a field has been left, re-check it as the person types so the error clears as soon as it's fixed.
    if (touched[name]) setErrors((errs) => ({ ...errs, [name]: validate(next)[name] }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    if (form[name]) setErrors((errs) => ({ ...errs, [name]: validate(form)[name] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const found = validate(form)
    setErrors(found)
    setTouched({ email: true, password: true })
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus()
      return
    }

    setLoading(true)
    try {
      // Expected API response: { token, user: { id, name, email, role: "student" | "tutor" } }
      const data = await authApi.login({ email: form.email.trim(), password: form.password })
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
      setServerError(
        err?.status === 401 || !err?.message
          ? 'That email and password don’t match. Check them and try again.'
          : err.message
      )
      document.getElementById('password')?.select()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="text-[32px] font-bold leading-tight tracking-tight text-primary">Welcome back</h1>
      <p className="mt-2 text-on-surface-variant">Log in to follow tutors, like courses and join the discussion.</p>

      <div className="mt-8">
        {reason && <AuthBanner tone="info">{reason}</AuthBanner>}
        {serverError && <AuthBanner>{serverError}</AuthBanner>}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <AuthField
          id="email"
          label="Email"
          icon={Mail}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="you@example.com"
          error={errors.email}
        />

        <AuthField id="password" label="Password" icon={Lock} error={errors.password}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Your password"
            error={errors.password}
          />
        </AuthField>

        <Button
          type="submit"
          disabled={loading}
          className="mt-2 h-12 w-full rounded-full text-base font-semibold shadow-none hover:bg-primary-container"
        >
          {loading && <Spinner />}
          {loading ? 'Logging in…' : 'Log in'}
        </Button>
      </form>

      {USE_MOCKS && (
        <p className="mt-6 rounded-xl border border-dashed border-outline-variant px-4 py-3 text-xs leading-relaxed text-on-surface-variant">
          <span className="font-semibold text-on-surface">Sample mode.</span> Any email and password work. Use an email
          with “tutor” in it to open the tutor studio.
        </p>
      )}

      <p className="mt-8 text-center text-sm text-on-surface-variant">
        New to LearnHub?{' '}
        <Link to="/register" state={location.state} className="font-semibold text-primary underline-offset-4 hover:underline">
          Create a free account
        </Link>
      </p>
    </>
  )
}
