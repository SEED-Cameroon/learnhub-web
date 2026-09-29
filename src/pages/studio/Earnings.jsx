import { ArrowDownRight, ArrowUpRight, FlaskConical, Users, Wallet } from 'lucide-react'
import { useSeo } from '@/hooks/useSeo'
import { useAsync } from '@/hooks/useAsync'
import { getEarnings } from '@/services/studio'
import { PROVIDERS } from '@/services/subscriptions'
import PageHeader from '@/components/common/PageHeader'
import Avatar from '@/components/common/Avatar'
import StatusBadge from '@/components/common/StatusBadge'
import { ErrorState, Skeleton } from '@/components/common/States'
import { Panel } from '@/components/studio/Field'
import { formatDate, formatXaf } from '@/lib/format'

const providerLabel = (value) => PROVIDERS.find((p) => p.value === value)?.label ?? value

function TestBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary-fixed px-2 py-0.5 text-xs font-semibold text-on-secondary-container">
      <FlaskConical className="size-3" aria-hidden="true" />
      Test
    </span>
  )
}

function MonthComparison({ current, previous }) {
  const change = previous ? Math.round(((current - previous) / previous) * 100) : null
  const up = change === null || change >= 0
  const Icon = up ? ArrowUpRight : ArrowDownRight

  return (
    <Panel className="grid gap-6 sm:grid-cols-2">
      <div>
        <p className="text-sm text-on-surface-variant">This month so far</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-tertiary-container">{formatXaf(current)}</p>
        {change !== null && (
          <p className={`mt-2 flex items-center gap-1 text-sm ${up ? 'text-tertiary-container' : 'text-error'}`}>
            <Icon className="size-4" aria-hidden="true" />
            {up ? 'Up' : 'Down'} {Math.abs(change)}% on last month
          </p>
        )}
      </div>
      <div className="sm:border-l sm:border-outline-variant/60 sm:pl-6">
        <p className="text-sm text-on-surface-variant">Last month</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-on-surface">{formatXaf(previous)}</p>

      </div>
    </Panel>
  )
}

export default function Earnings() {
  useSeo({ title: 'Earnings', noindex: true })
  const { data, error, loading, reload } = useAsync(getEarnings, [])
  const hasTest = data && (data.payments.some((p) => p.testMode) || data.supporters.some((s) => s.testMode))

  return (
    <>
      <PageHeader title="Earnings" description="What your supporters pay you through MTN Mobile Money and Orange Money." />

      {loading && (
        <div className="space-y-6" role="status" aria-label="Loading">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      )}
      {error && <ErrorState error={error} onRetry={reload} title="Your earnings didn’t load" />}

      {data && (
        <div className="space-y-6">
          {hasTest && (
            <p className="flex items-start gap-2 rounded-xl bg-secondary-fixed/60 px-4 py-3 text-sm text-on-secondary-container">
              <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Payments marked Test were confirmed by LearnHub’s test mode. No real money moved; live Mobile Money payments
              will replace them once the providers are connected.
            </p>
          )}

          <MonthComparison current={data.thisMonthXaf} previous={data.lastMonthXaf} />

          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <Panel>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-on-surface">
                <Users className="size-5 text-on-surface-variant" aria-hidden="true" />
                Active supporters
              </h2>
              {data.supporters.length === 0 ? (
                <p className="mt-4 text-on-surface-variant">No one is supporting you yet. Share your profile link with your students.</p>
              ) : (
                <>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {formatXaf(data.monthlySupportXaf)} a month from {data.supporters.length}{' '}
                    {data.supporters.length === 1 ? 'supporter' : 'supporters'}
                  </p>
                  <ul className="mt-3 divide-y divide-outline-variant/60">
                    {data.supporters.map((s) => (
                      <li key={s.id} className="flex items-center gap-3 py-3">
                        <Avatar name={s.name} src={s.avatarUrl} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-2 truncate font-medium text-on-surface">
                            {s.name}
                            {s.testMode && <TestBadge />}
                          </p>
                          <p className="text-sm text-on-surface-variant">Since {formatDate(s.since)}</p>
                        </div>
                        <p className="whitespace-nowrap text-sm font-semibold text-tertiary-container">{formatXaf(s.amountXaf)} / month</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Panel>

            <Panel>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-on-surface">
                <Wallet className="size-5 text-on-surface-variant" aria-hidden="true" />
                Payment history
              </h2>
              {data.payments.length === 0 ? (
                <p className="mt-4 text-on-surface-variant">Payments from your supporters will appear here.</p>
              ) : (
                <>
                  <table className="mt-4 hidden w-full text-left text-sm sm:table">
                    <thead className="text-on-surface-variant">
                      <tr className="border-b border-outline-variant/60">
                        <th scope="col" className="py-2 pr-3 font-semibold">Date</th>
                        <th scope="col" className="py-2 pr-3 font-semibold">From</th>
                        <th scope="col" className="py-2 pr-3 font-semibold">Status</th>
                        <th scope="col" className="py-2 text-right font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/60">
                      {data.payments.map((p) => (
                        <tr key={p.id}>
                          <td className="py-3 pr-3 whitespace-nowrap">{formatDate(p.date)}</td>
                          <td className="py-3 pr-3">
                            <span className="flex items-center gap-2">
                              {p.name}
                              {p.testMode && <TestBadge />}
                            </span>
                            <span className="text-xs text-on-surface-variant">{providerLabel(p.provider)}</span>
                          </td>
                          <td className="py-3 pr-3"><StatusBadge status={p.status} /></td>
                          <td className="py-3 text-right font-semibold whitespace-nowrap text-tertiary-container tabular-nums">{formatXaf(p.amountXaf)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <ul className="mt-4 divide-y divide-outline-variant/60 sm:hidden">
                    {data.payments.map((p) => (
                      <li key={p.id} className="flex items-start justify-between gap-3 py-3">
                        <div>
                          <p className="flex items-center gap-2 font-medium text-on-surface">
                            {p.name}
                            {p.testMode && <TestBadge />}
                          </p>
                          <p className="text-sm text-on-surface-variant">
                            {formatDate(p.date)} · {providerLabel(p.provider)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-semibold text-tertiary-container">{formatXaf(p.amountXaf)}</span>
                          <StatusBadge status={p.status} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Panel>
          </div>
        </div>
      )}
    </>
  )
}
