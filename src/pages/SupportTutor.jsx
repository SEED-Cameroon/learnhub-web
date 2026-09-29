import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BadgeCheck, Check, Clock, LockOpen, Smartphone, UserX } from 'lucide-react'
import { useAsync } from '@/hooks/useAsync'
import { getTutor } from '@/services/tutors'
import { createSubscription, PHONE_PATTERN, PROVIDERS, SUPPORT_AMOUNTS_XAF } from '@/services/subscriptions'
import { formatXaf } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Avatar from '@/components/common/Avatar'
import Container from '@/components/common/Container'
import { EmptyState, ErrorState, Skeleton } from '@/components/common/States'
import FormStatus from '@/components/account/FormStatus'

const MIN_AMOUNT_XAF = 100
const CUSTOM = 'custom'

// "671234567" -> "6 71 23 45 67", the way Cameroonian numbers are usually written.
const formatPhone = (digits) => digits.replace(/^(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5')

const choiceClass = (selected) =>
  cn(
    'flex cursor-pointer items-center justify-center whitespace-nowrap rounded-xl border-2 px-2 py-3 text-center font-semibold transition-colors',
    'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-surface-tint',
    selected
      ? 'border-primary bg-primary-fixed/50 text-primary'
      : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary/50'
  )

function TutorSummary({ tutor }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar name={tutor.name} src={tutor.avatarUrl} size="md" />
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 font-semibold text-on-surface">
          <span className="truncate">{tutor.name}</span>
          {tutor.verified && <BadgeCheck className="size-4 shrink-0 text-primary" aria-label="Verified tutor" />}
        </p>
        <p className="truncate text-sm text-on-surface-variant">{tutor.headline}</p>
      </div>
    </div>
  )
}

function PendingView({ tutor, subscription, phone }) {
  const provider = PROVIDERS.find((p) => p.value === subscription.provider)

  return (
    <section aria-live="polite" className="rounded-xl bg-surface-container-lowest p-6 elevation-1 md:p-8">
      <div className="flex size-12 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-container">
        <Smartphone className="size-6" aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-primary">Approve the payment on your phone</h1>
      <p className="mt-2 text-on-surface-variant">
        {provider?.label} sent a payment request to +237 {formatPhone(phone)}. Enter your PIN to approve it. We’ll confirm your support once
        your provider does, which usually takes a minute or two.
      </p>

      <dl className="mt-6 grid gap-3 rounded-lg bg-surface-container-low p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-on-surface-variant">Supporting</dt>
          <dd className="font-semibold text-on-surface">{tutor.name}</dd>
        </div>
        <div>
          <dt className="text-on-surface-variant">Amount</dt>
          <dd className="font-semibold text-on-surface">{formatXaf(subscription.amountXaf)} a month</dd>
        </div>
        <div>
          <dt className="text-on-surface-variant">Status</dt>
          <dd className="flex items-center gap-1.5 font-semibold text-on-secondary-container">
            <Clock className="size-4" aria-hidden="true" />
            Waiting for approval
          </dd>
        </div>
        <div>
          <dt className="text-on-surface-variant">Reference</dt>
          <dd className="font-semibold text-on-surface">{subscription.id}</dd>
        </div>
      </dl>

      <p className="mt-4 text-sm text-on-surface-variant">
        No request on your phone? Check that the number is right, then try again from My subscriptions.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild className="h-auto rounded-full px-6 py-2.5 shadow-none">
          <Link to="/account/subscriptions">Go to my subscriptions</Link>
        </Button>
        <Button asChild variant="outline" className="h-auto rounded-full px-6 py-2.5">
          <Link to={`/tutors/${tutor.id}`}>Back to {tutor.name}</Link>
        </Button>
      </div>
    </section>
  )
}

function SupportForm({ tutor, onPending }) {
  const [choice, setChoice] = useState(SUPPORT_AMOUNTS_XAF[1])
  const [custom, setCustom] = useState('')
  const [provider, setProvider] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const amount = choice === CUSTOM ? Number(custom) : choice
  const digits = phone.replace(/\s+/g, '')

  const onSubmit = async (event) => {
    event.preventDefault()
    const next = {}
    if (!Number.isInteger(amount) || amount < MIN_AMOUNT_XAF) next.amount = `Enter a whole amount of at least ${formatXaf(MIN_AMOUNT_XAF)}.`
    if (!provider) next.provider = 'Choose MTN Mobile Money or Orange Money.'
    if (!PHONE_PATTERN.test(digits)) next.phone = 'Enter a 9-digit Cameroon number starting with 6, like 6 71 23 45 67.'
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus({ state: 'pending', message: '' })
    try {
      const subscription = await createSubscription({ tutorId: tutor.id, amountXaf: amount, provider, phone: digits })
      onPending(subscription, digits)
    } catch (err) {
      setStatus({
        state: 'error',
        message:
          err?.status === 409 ? (
            <span>
              You already support this tutor.{' '}
              <Link to="/account/subscriptions" className="font-semibold underline underline-offset-2">
                Manage it in My subscriptions
              </Link>
              .
            </span>
          ) : (
            err?.message || 'The payment request wasn’t sent. Check your number and try again.'
          ),
      })
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-xl bg-surface-container-lowest p-6 elevation-1 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">Support {tutor.name}</h1>
      <div className="mt-5">
        <TutorSummary tutor={tutor} />
      </div>

      <p className="mt-6 flex items-start gap-2.5 rounded-lg bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
        <LockOpen className="mt-0.5 size-4 shrink-0 text-tertiary-container" aria-hidden="true" />
        Support is a monthly thank-you. Every course stays free to watch whether you support a tutor or not, and you can cancel any time.
      </p>

      <fieldset className="mt-8" aria-describedby={errors.amount ? 'amount-error' : undefined}>
        <legend className="font-semibold text-on-surface">Monthly amount</legend>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {SUPPORT_AMOUNTS_XAF.map((value) => (
            <label key={value} className={choiceClass(choice === value)}>
              <input type="radio" name="amount" value={value} checked={choice === value} onChange={() => setChoice(value)} className="sr-only" />
              {formatXaf(value)}
            </label>
          ))}
          <label className={cn(choiceClass(choice === CUSTOM), 'col-span-2 sm:col-span-1')}>
            <input type="radio" name="amount" value={CUSTOM} checked={choice === CUSTOM} onChange={() => setChoice(CUSTOM)} className="sr-only" />
            Other
          </label>
        </div>
        {choice === CUSTOM && (
          <div className="mt-3 max-w-xs">
            <Label htmlFor="custom-amount" className="text-on-surface">
              Amount in XAF
            </Label>
            <Input
              id="custom-amount"
              type="number"
              inputMode="numeric"
              min={MIN_AMOUNT_XAF}
              step={1}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              aria-invalid={errors.amount ? true : undefined}
              aria-describedby={errors.amount ? 'amount-error' : 'amount-hint'}
              className="mt-2 h-11 bg-surface-container-lowest"
              autoFocus
            />
            {!errors.amount && (
              <p id="amount-hint" className="mt-2 text-sm text-on-surface-variant">
                Minimum {formatXaf(MIN_AMOUNT_XAF)}.
              </p>
            )}
          </div>
        )}
        {errors.amount && (
          <p id="amount-error" className="mt-2 text-sm text-error">
            {errors.amount}
          </p>
        )}
      </fieldset>

      <fieldset className="mt-8" aria-describedby={errors.provider ? 'provider-error' : undefined}>
        <legend className="font-semibold text-on-surface">Pay with</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {PROVIDERS.map((p) => (
            <label key={p.value} className={cn(choiceClass(provider === p.value), 'justify-start gap-3 px-4 py-4 text-left')}>
              <input type="radio" name="provider" value={p.value} checked={provider === p.value} onChange={() => setProvider(p.value)} className="sr-only" />
              <span
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                  provider === p.value ? 'border-primary bg-primary text-on-primary' : 'border-outline'
                )}
                aria-hidden="true"
              >
                {provider === p.value && <Check className="size-3" strokeWidth={3} />}
              </span>
              {p.label}
            </label>
          ))}
        </div>
        {errors.provider && (
          <p id="provider-error" className="mt-2 text-sm text-error">
            {errors.provider}
          </p>
        )}
      </fieldset>

      <div className="mt-8 max-w-md">
        <Label htmlFor="phone" className="font-semibold text-on-surface">
          Mobile Money number
        </Label>
        <div className="mt-3 flex">
          <span className="flex items-center rounded-l-md border border-r-0 border-input bg-surface-container-low px-3 text-on-surface-variant">
            +237
          </span>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="6 71 23 45 67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'}
            className="h-11 rounded-l-none bg-surface-container-lowest"
          />
        </div>
        <p id={errors.phone ? 'phone-error' : 'phone-hint'} className={cn('mt-2 text-sm', errors.phone ? 'text-error' : 'text-on-surface-variant')}>
          {errors.phone || 'You’ll get a prompt on this phone to approve the payment.'}
        </p>
      </div>

      <div className="mt-8">
        <FormStatus status={status.state} message={status.message} />
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-outline-variant pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-on-surface-variant">
          {amount >= MIN_AMOUNT_XAF ? (
            <>
              You’ll pay <span className="font-semibold text-on-surface">{formatXaf(amount)}</span> each month.
            </>
          ) : (
            'Choose an amount to continue.'
          )}
        </p>
        <Button type="submit" disabled={status.state === 'pending'} className="h-auto rounded-full px-6 py-3 shadow-none">
          {status.state === 'pending' ? 'Sending request…' : 'Send payment request'}
        </Button>
      </div>
    </form>
  )
}

export default function SupportTutor() {
  const { id } = useParams()
  const { data: tutor, error, loading, reload } = useAsync(() => getTutor(id), [id])
  const [pending, setPending] = useState(null)

  let body
  if (loading) {
    body = (
      <div className="space-y-4 rounded-xl bg-surface-container-lowest p-8 elevation-1" role="status" aria-label="Loading">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  } else if (error?.status === 404) {
    body = (
      <EmptyState
        icon={UserX}
        title="We couldn’t find this tutor"
        action={
          <Button asChild className="h-auto rounded-full px-6 py-2.5 shadow-none">
            <Link to="/tutors">Browse tutors</Link>
          </Button>
        }
      >
        The link may be old, or the tutor may have closed their account.
      </EmptyState>
    )
  } else if (error) {
    body = <ErrorState error={error} onRetry={reload} title="This tutor didn’t load" />
  } else if (pending) {
    body = <PendingView tutor={tutor} subscription={pending.subscription} phone={pending.phone} />
  } else {
    body = <SupportForm tutor={tutor} onPending={(subscription, phone) => setPending({ subscription, phone })} />
  }

  return (
    <Container className="py-10 md:py-12">
      <div className="mx-auto max-w-2xl">
        {!pending && (
          <Link
            to={tutor ? `/tutors/${tutor.id}` : '/tutors'}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {tutor ? `Back to ${tutor.name}` : 'Back to tutors'}
          </Link>
        )}
        {body}
      </div>
    </Container>
  )
}
