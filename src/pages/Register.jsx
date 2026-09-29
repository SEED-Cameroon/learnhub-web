import { startTransition, useState } from 'react'
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom'
import { Check, GraduationCap, Lock, Mail, Presentation, UserRound } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authApi } from '@/services/api'
import { homeFor } from '@/components/auth/ProtectedRoute'
import { AuthBanner, AuthField, PasswordInput, Spinner } from '@/components/auth/AuthField'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN = 8

const ROLES = [
  { value: 'student', label: 'I want to learn', description: 'Watch courses, follow tutors', Icon: GraduationCap },
  { value: 'tutor', label: 'I want to teach', description: 'Publish courses, get supported', Icon: Presentation },
]

// Only length is required (SRS §4.2); the other checks are guidance toward a stronger password.
const PASSWORD_CHECKS = [
  { label: `${PASSWORD_MIN}+ characters`, test: (p) => p.length >= PASSWORD_MIN },
  { label: 'A number', test: (p) => /\d/.test(p) },
  { label: 'Upper and lower case', test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
]

const STRENGTH = [
  { label: 'Too short', bar: 'bg-error', width: 'w-1/4' },
  { label: 'Okay', bar: 'bg-secondary-container', width: 'w-2/4' },
  { label: 'Good', bar: 'bg-surface-tint', width: 'w-3/4' },
  { label: 'Strong', bar: 'bg-tertiary-container', width: 'w-full' },
]

function validate({ name, email, password }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Enter your full name.'
  else if (name.trim().length < 2) errors.name = 'Enter your full name as students or tutors will see it.'
  if (!email.trim()) errors.email = 'Enter your email address.'
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter an email like name@example.com.'
  if (!password) errors.password = 'Choose a password.'
  else if (password.length < PASSWORD_MIN) errors.password = `Use at least ${PASSWORD_MIN} characters.`
  return errors
}

function PasswordStrength({ password }) {
  if (!password) return null
  const passed = PASSWORD_CHECKS.filter((c) => c.test(password)).length
  const level = password.length < PASSWORD_MIN ? STRENGTH[0] : STRENGTH[Math.min(passed, 3)]

  return (
    <div id="password-strength" className="space-y-2 pt-1" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container">
          <div className={cn('h-full rounded-full transition-all duration-300', level.bar, level.width)} />
        </div>
        <span className="w-16 text-right text-xs font-semibold text-on-surface-variant">{level.label}</span>
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {PASSWORD_CHECKS.map((check) => {
          const ok = check.test(password)
          return (
            <li key={check.label} className={cn('flex items-center gap-1', ok ? 'text-tertiary-container' : 'text-outline')}>
              <Check className={cn('size-3.5', !ok && 'opacity-40')} aria-hidden="true" />
              {check.label}
              <span className="sr-only">{ok ? '(done)' : '(not yet)'}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function RolePicker({ value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-on-surface">How will you use LearnHub?</legend>
      <div className="grid grid-cols-2 gap-3">
        {ROLES.map(({ value: role, label, description, Icon }) => {
          const checked = value === role
          return (
            <label
              key={role}
              className={cn(
                'relative flex cursor-pointer flex-col gap-2 rounded-2xl border-2 p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-surface-tint',
                checked
                  ? 'border-primary bg-primary-fixed/40'
                  : 'border-outline-variant bg-surface-container-lowest hover:border-primary/40'
              )}
            >
              <input
                type="radio"
                name="role"
                value={role}
                checked={checked}
                onChange={() => onChange(role)}
                className="sr-only"
              />
              <span
                className={cn(
                  'flex size-9 items-center justify-center rounded-xl',
                  checked ? 'bg-primary text-secondary-container' : 'bg-surface-container text-on-surface-variant'
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-on-surface">{label}</span>
              <span className="text-xs leading-snug text-on-surface-variant">{description}</span>
              {checked && (
                <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-on-primary">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
              )}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default function Register() {
  const [searchParams, setSearchParams] = useSearchParams()
  const role = searchParams.get('role') === 'tutor' ? 'tutor' : 'student'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isTutor = role === 'tutor'

  // The role lives in the URL so "Become a tutor" links open this form ready to teach,
  // and the side panel can follow the choice.
  const setRole = (next) => {
    const params = new URLSearchParams(searchParams)
    if (next === 'tutor') params.set('role', 'tutor')
    else params.delete('role')
    setSearchParams(params, { replace: true, state: location.state })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const next = { ...form, [name]: value }
    setForm(next)
    setServerError('')
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
    setTouched({ name: true, email: true, password: true })
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus()
      return
    }

    setLoading(true)
    try {
      const data = await authApi.register({ ...form, name: form.name.trim(), email: form.email.trim(), role })
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
      setServerError(
        err?.status === 409
          ? 'An account with this email already exists. Log in instead, or use another email.'
          : err?.message || 'Your account wasn’t created. Try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="text-[32px] font-bold leading-tight tracking-tight text-primary">Create your free account</h1>
      <p className="mt-2 text-on-surface-variant">
        {isTutor
          ? 'Set up your tutor studio and publish your first course.'
          : 'Follow tutors, like courses and ask questions in the comments.'}
      </p>

      <div className="mt-8">{serverError && <AuthBanner>{serverError}</AuthBanner>}</div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <RolePicker value={role} onChange={setRole} />

        <AuthField
          id="name"
          label="Full name"
          icon={UserRound}
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. Awa Ndzi"
          hint={isTutor ? 'This is the name students see on your courses.' : undefined}
          error={errors.name}
        />
        <AuthField
          id="email"
          label="Email"
          icon={Mail}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="you@example.com"
          error={errors.email}
        />

        <div>
          <AuthField id="password" label="Password" icon={Lock} error={errors.password}>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={`At least ${PASSWORD_MIN} characters`}
              error={errors.password}
              describedBy={form.password ? 'password-strength' : undefined}
            />
          </AuthField>
          <PasswordStrength password={form.password} />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-2 h-12 w-full rounded-full text-base font-semibold shadow-none hover:bg-primary-container"
        >
          {loading && <Spinner />}
          {loading ? 'Creating your account…' : isTutor ? 'Create tutor account' : 'Create account'}
        </Button>

        <p className="text-center text-xs leading-relaxed text-on-surface-variant">
          By creating an account you agree to use LearnHub respectfully. Courses stay free whether or not you support a
          tutor.
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-on-surface-variant">
        Already have an account?{' '}
        <Link to="/login" state={location.state} className="font-semibold text-primary underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </>
  )
}
