import { startTransition, useState } from 'react'
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom'
import { Lock, Mail, UserRound } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authApi } from '@/services/api'
import { homeFor } from '@/components/auth/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN = 8
const FIELD =
  'h-auto rounded-lg border-outline-variant py-3 pl-10 pr-3 focus-visible:border-primary focus-visible:ring-primary'

function validate({ name, email, password }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Enter your full name.'
  if (!email.trim()) errors.email = 'Enter your email address.'
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter an email like name@example.com.'
  if (!password) errors.password = 'Choose a password.'
  else if (password.length < PASSWORD_MIN) errors.password = `Use at least ${PASSWORD_MIN} characters.`
  return errors
}

function Field({ id, label, icon: Icon, error, hint, ...inputProps }) {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-semibold text-on-surface">
        {label}
      </Label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-outline"
          aria-hidden="true"
        />
        <Input
          id={id}
          name={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={FIELD}
          {...inputProps}
        />
      </div>
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-on-surface-variant">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
}

export default function Register() {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: searchParams.get('role') === 'tutor' ? 'tutor' : 'student',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((errs) => ({ ...errs, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus()
      return
    }

    setLoading(true)
    try {
      const data = await authApi.register({ ...form, name: form.name.trim(), email: form.email.trim() })
      // React Router applies navigation as a transition. Setting the user in the same transition renders both
      // together; otherwise GuestOnly sees the user first and redirects to the role home instead of `from`.
      const from = location.state?.from
      if (from && data.user.role !== 'tutor') {
        navigate(from, {
          replace: true,
          state: location.state?.pendingAction ? { pendingAction: location.state.pendingAction } : null,
        })
      } else {
        navigate(homeFor(data.user), { replace: true })
      }
      startTransition(() => login(data.user, data.token))
    } catch (err) {
      // Field-level errors from the API land on their inputs; anything else goes in the banner.
      if (err?.fieldErrors && typeof err.fieldErrors === 'object') setErrors(err.fieldErrors)
      setServerError(err?.message || 'Your account wasn’t created. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const isTutor = form.role === 'tutor'

  return (
    <div className="w-full max-w-md">
      <Card className="relative overflow-hidden rounded-xl border-surface-variant py-0 shadow-[0px_12px_32px_rgba(0,0,0,0.08)]">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-secondary-container" />
        <CardContent className="p-6 sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-[28px] font-bold leading-9 text-primary">Create your account</h1>
            <p className="mt-2 text-base text-on-surface-variant">
              {isTutor
                ? 'Publish courses and receive support from students.'
                : 'Follow tutors, like courses and join the discussion.'}
            </p>
          </div>

          {serverError && (
            <div role="alert" className="mb-6 rounded-lg bg-error-container p-3 text-sm text-on-error-container">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <fieldset>
              <legend className="sr-only">I want to</legend>
              <div className="flex items-center rounded-full bg-surface-container-low p-1">
                {[
                  { value: 'student', label: 'Learn' },
                  { value: 'tutor', label: 'Teach' },
                ].map((opt) => (
                  <label key={opt.value} className="relative w-1/2 cursor-pointer text-center">
                    <input
                      type="radio"
                      name="role"
                      value={opt.value}
                      checked={form.role === opt.value}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <span
                      className={cn(
                        'block rounded-full px-4 py-2 text-sm font-semibold text-on-surface-variant transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
                        opt.value === 'student'
                          ? 'peer-checked:bg-primary peer-checked:text-on-primary peer-focus-visible:ring-primary hover:text-primary'
                          : 'peer-checked:bg-secondary peer-checked:text-white peer-focus-visible:ring-secondary hover:text-secondary',
                      )}
                    >
                      I want to {opt.label.toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="space-y-4">
              <Field
                id="name"
                label="Full name"
                icon={UserRound}
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Awa Ndzi"
                error={errors.name}
              />
              <Field
                id="email"
                label="Email"
                icon={Mail}
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={errors.email}
              />
              <Field
                id="password"
                label="Password"
                icon={Lock}
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Choose a password"
                hint={`At least ${PASSWORD_MIN} characters.`}
                error={errors.password}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-auto w-full rounded-full py-3 text-sm hover:bg-primary-container hover:shadow-md"
            >
              {loading ? 'Creating account…' : isTutor ? 'Create tutor account' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link
              to="/login"
              state={location.state}
              className="font-bold text-primary decoration-2 underline-offset-4 hover:underline"
            >
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
