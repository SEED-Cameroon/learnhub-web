import { ArrowDownRight, ArrowUpRight, Clock3, Users, Wallet } from 'lucide-react'
import { useAsync } from '@/hooks/useAsync'
import { EARNINGS_ENABLED, getEarnings } from '@/services/studio'
import { PROVIDERS } from '@/services/subscriptions'
import PageHeader from '@/components/common/PageHeader'
import Avatar from '@/components/common/Avatar'
import StatusBadge from '@/components/common/StatusBadge'
import { EmptyState, ErrorState, Skeleton } from '@/components/common/States'
import { Panel } from '@/components/studio/Field'
import { formatDate, formatXaf } from '@/lib/format'

const providerLabel = (value) => PROVIDERS.find((p) => p.value === value)?.label ?? value

function ComingSoon() {
  return (
    <EmptyState icon={Clock3} title="Earnings are coming soon">
      Once Mobile Money payments are connected, this page will show what supporters pay you each month, your supporter list
      and every payout sent to your phone. Supporters can’t be charged until then.
    </EmptyState>
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
        <p className="mt-2 text-sm text-on-surface-variant">Paid out on the 1st of each month</p>
      </div>
    </Panel>
  )
}

export default function Earnings() {
  const { data, error, loading, reload } = useAsync(() => (EARNINGS_ENABLED ? getEarnings() : Promise.resolve(null)), [])

  return (
    <>
      <PageHeader title="Earnings" description="What your supporters pay you, and the payouts sent to your Mobile Money account." />

      {!EARNINGS_ENABLED && <ComingSoon />}

      {EARNINGS_ENABLED && loading && (
        <div className="space-y-6" role="status" aria-label="Loading">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      )}
      {EARNINGS_ENABLED && error && <ErrorState error={error} onRetry={reload} title="Your earnings didn’t load" />}

      {EARNINGS_ENABLED && data && (
        <div className="space-y-6">
          <MonthComparison current={data.stats.earningsXaf} previous={data.stats.earningsLastMonthXaf} />

          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <Panel>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-on-surface">
                <Users className="size-5 text-on-surface-variant" aria-hidden="true" />
                Active supporters
              </h2>
              {data.supporters.length === 0 ? (
                <p className="mt-4 text-on-surface-variant">No one is supporting you yet. Share your profile link with your students.</p>
              ) : (
                <ul className="mt-4 divide-y divide-outline-variant/60">
                  {data.supporters.map((s) => (
                    <li key={s.id} className="flex items-center gap-3 py-3">
                      <Avatar name={s.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-on-surface">{s.name}</p>
                        <p className="text-sm text-on-surface-variant">Since {formatDate(s.since)}</p>
                      </div>
                      <p className="whitespace-nowrap text-sm font-semibold text-tertiary-container">{formatXaf(s.amountXaf)} / month</p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-on-surface">
                <Wallet className="size-5 text-on-surface-variant" aria-hidden="true" />
                Payout history
              </h2>
              {data.payouts.length === 0 ? (
                <p className="mt-4 text-on-surface-variant">Your first payout will appear here after your first full month of support.</p>
              ) : (
                <>
                  <table className="mt-4 hidden w-full text-left text-sm sm:table">
                    <thead className="text-on-surface-variant">
                      <tr className="border-b border-outline-variant/60">
                        <th scope="col" className="py-2 pr-3 font-semibold">Date</th>
                        <th scope="col" className="py-2 pr-3 font-semibold">Sent to</th>
                        <th scope="col" className="py-2 pr-3 font-semibold">Status</th>
                        <th scope="col" className="py-2 text-right font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/60">
                      {data.payouts.map((p) => (
                        <tr key={p.id}>
                          <td className="py-3 pr-3 whitespace-nowrap">{formatDate(p.paidAt)}</td>
                          <td className="py-3 pr-3">{providerLabel(p.provider)}</td>
                          <td className="py-3 pr-3"><StatusBadge status={p.status} /></td>
                          <td className="py-3 text-right font-semibold whitespace-nowrap text-tertiary-container tabular-nums">{formatXaf(p.amountXaf)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <ul className="mt-4 divide-y divide-outline-variant/60 sm:hidden">
                    {data.payouts.map((p) => (
                      <li key={p.id} className="flex items-start justify-between gap-3 py-3">
                        <div>
                          <p className="font-medium text-on-surface">{formatDate(p.paidAt)}</p>
                          <p className="text-sm text-on-surface-variant">{providerLabel(p.provider)}</p>
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
