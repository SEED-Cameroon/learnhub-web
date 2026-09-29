import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HeartHandshake } from 'lucide-react'
import { useAsync } from '@/hooks/useAsync'
import { cancelSubscription, listMySubscriptions, PROVIDERS } from '@/services/subscriptions'
import { formatDate, formatXaf } from '@/lib/format'
import { Button } from '@/components/ui/button'
import Avatar from '@/components/common/Avatar'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import Container from '@/components/common/Container'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import { EmptyState, ErrorState, Skeleton } from '@/components/common/States'

const CANCELLABLE = ['active', 'pending']
const providerLabel = (value) => PROVIDERS.find((p) => p.value === value)?.label ?? value

function SubscriptionRow({ sub, onCancel }) {
  const tutorName = sub.tutor?.name ?? 'Tutor'

  return (
    <li className="grid gap-4 rounded-xl bg-surface-container-lowest p-5 elevation-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1.3fr)_9.5rem] md:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={tutorName} src={sub.tutor?.avatarUrl} size="md" />
        <div className="min-w-0">
          <Link to={`/tutors/${sub.tutorId}`} className="block truncate font-semibold text-on-surface hover:text-primary hover:underline">
            {tutorName}
          </Link>
          <p className="truncate text-sm text-on-surface-variant">{providerLabel(sub.provider)}</p>
        </div>
      </div>

      <dl className="contents text-sm">
        <div className="flex justify-between md:block">
          <dt className="text-on-surface-variant md:sr-only">Amount</dt>
          <dd className="font-semibold text-on-surface">{formatXaf(sub.amountXaf)} / month</dd>
        </div>
        <div className="flex justify-between md:block">
          <dt className="text-on-surface-variant md:sr-only">Status</dt>
          <dd>
            <StatusBadge status={sub.status} />
          </dd>
        </div>
        <div className="flex justify-between md:block">
          <dt className="text-on-surface-variant md:hidden">Dates</dt>
          <dd className="text-right text-on-surface-variant md:text-left">
            <span className="block">Since {formatDate(sub.startedAt)}</span>
            {sub.nextBillingAt && <span className="block">Next payment {formatDate(sub.nextBillingAt)}</span>}
          </dd>
        </div>
      </dl>

      <div className="md:text-right">
        {CANCELLABLE.includes(sub.status) ? (
          <Button variant="outline" className="h-auto w-full rounded-full px-4 py-2 md:w-auto" onClick={() => onCancel(sub)}>
            Cancel support
          </Button>
        ) : (
          <span className="hidden text-sm text-on-surface-variant md:inline">—</span>
        )}
      </div>
    </li>
  )
}

export default function Subscriptions() {
  const { data, error, loading, reload, setData } = useAsync(listMySubscriptions)
  const [target, setTarget] = useState(null)
  const [notice, setNotice] = useState('')

  const active = data?.filter((s) => s.status === 'active') ?? []
  const monthlyTotal = active.reduce((sum, s) => sum + s.amountXaf, 0)

  const confirmCancel = async () => {
    const updated = await cancelSubscription(target.id)
    // The cancel response doesn't include the tutor's details, so keep the row's.
    setData((subs) => subs.map((s) => (s.id === target.id ? { ...s, ...updated, tutor: updated.tutor ?? s.tutor } : s)))
    setNotice(`Support cancelled. You won’t be charged for ${target.tutor?.name ?? 'this tutor'} again.`)
  }

  let body
  if (loading) {
    body = (
      <ul className="flex flex-col gap-3" role="status" aria-label="Loading">
        {[0, 1, 2].map((i) => (
          <li key={i} className="flex items-center gap-4 rounded-xl bg-surface-container-lowest p-5 elevation-1">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </li>
        ))}
      </ul>
    )
  } else if (error) {
    body = <ErrorState error={error} onRetry={reload} title="Your subscriptions didn’t load" />
  } else if (!data.length) {
    body = (
      <EmptyState
        icon={HeartHandshake}
        title="You’re not supporting any tutors yet"
        action={
          <Button asChild className="h-auto rounded-full px-6 py-2.5 shadow-none">
            <Link to="/tutors">Find a tutor to support</Link>
          </Button>
        }
      >
        Support a tutor with a monthly Mobile Money payment. Their courses stay free either way.
      </EmptyState>
    )
  } else {
    body = (
      <ul className="flex flex-col gap-3">
        {data.map((sub) => (
          <SubscriptionRow key={sub.id} sub={sub} onCancel={setTarget} />
        ))}
      </ul>
    )
  }

  return (
    <Container className="py-10 md:py-12">
      <PageHeader
        title="My subscriptions"
        description={
          data?.length
            ? active.length
              ? `You support ${active.length} ${active.length === 1 ? 'tutor' : 'tutors'} with ${formatXaf(monthlyTotal)} a month.`
              : 'You have no active support right now.'
            : 'The tutors you support with Mobile Money.'
        }
      />

      {notice && (
        <p role="status" className="mb-6 rounded-lg bg-tertiary-fixed/50 px-4 py-3 text-sm text-tertiary-container">
          {notice}
        </p>
      )}

      {body}

      <ConfirmDialog
        open={Boolean(target)}
        onOpenChange={(open) => !open && setTarget(null)}
        title="Cancel support"
        description={
          target &&
          `Your ${formatXaf(target.amountXaf)} monthly payment to ${target.tutor?.name ?? 'this tutor'} will stop, and you won’t be charged again. You can still watch all of their courses.`
        }
        confirmLabel="Cancel support"
        cancelLabel="Keep supporting"
        onConfirm={confirmCancel}
      />
    </Container>
  )
}
