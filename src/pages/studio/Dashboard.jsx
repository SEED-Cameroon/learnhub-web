import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  Heart,
  MessageCircle,
  Plus,
  Star,
  UserPlus,
  UserRoundPen,
  Users,
  Wallet,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useAsync } from '@/hooks/useAsync'
import { getStudioOverview, listMyCourses } from '@/services/studio'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/common/PageHeader'
import { ErrorState, Skeleton } from '@/components/common/States'
import { Panel } from '@/components/studio/Field'
import { formatCount, formatRelative, formatXaf } from '@/lib/format'

const ACTIVITY_ICONS = {
  support: Wallet,
  comment: MessageCircle,
  follow: UserPlus,
  like: Heart,
}

function firstName(name = '') {
  const words = name.replace(/^(Dr|Mme|Mr|Mrs|Prof)\.?\s+/i, '').split(/\s+/)
  return words[0] || 'there'
}

function StatTile({ icon: Icon, label, value, detail }) {
  return (
    <Panel className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm text-on-surface-variant">
        <Icon className="size-4" aria-hidden="true" />
        {label}
      </div>
      <p className="text-2xl font-bold tracking-tight text-on-surface">{value}</p>
      {detail && <div className="text-sm text-on-surface-variant">{detail}</div>}
    </Panel>
  )
}

function EarningsChange({ current, previous }) {
  if (!previous) return <span>First month of earnings</span>
  const change = Math.round(((current - previous) / previous) * 100)
  const up = change >= 0
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span className={`flex items-center gap-1 ${up ? 'text-tertiary-container' : 'text-error'}`}>
      <Icon className="size-4" aria-hidden="true" />
      {up ? 'Up' : 'Down'} {Math.abs(change)}% on last month
    </span>
  )
}

function QuickActions() {
  return (
    <>
      <Button asChild className="h-auto rounded-full px-5 py-2.5 shadow-none">
        <Link to="/dashboard/courses/new">
          <Plus aria-hidden="true" />
          New course
        </Link>
      </Button>
      <Button asChild variant="outline" className="h-auto rounded-full px-5 py-2.5">
        <Link to="/dashboard/profile">
          <UserRoundPen aria-hidden="true" />
          Edit public profile
        </Link>
      </Button>
    </>
  )
}

/** Shown to a brand-new tutor: no courses and no subscribers yet. */
function GettingStarted() {
  const steps = [
    { title: 'Set up your public profile', body: 'Add a photo, your subjects and a short bio so students know who they are learning from.', to: '/dashboard/profile', action: 'Edit public profile' },
    { title: 'Publish your first course', body: 'Start with one short course. You can save it as a draft and publish when it’s ready.', to: '/dashboard/courses/new', action: 'New course' },
    { title: 'Share it with your students', body: 'Send your course link on WhatsApp. Followers and supporters will show up here.', to: null, action: null },
  ]

  return (
    <Panel className="md:p-8">
      <h2 className="text-xl font-bold text-primary">Get your studio started</h2>
      <p className="mt-2 max-w-xl text-on-surface-variant">
        You don’t have any courses or supporters yet. These three steps get you to your first students.
      </p>
      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.title} className="flex flex-col gap-2 rounded-xl bg-surface-container-low p-5">
            <span className="flex size-8 items-center justify-center rounded-full bg-secondary-container text-sm font-bold text-on-secondary-container" aria-hidden="true">
              {i + 1}
            </span>
            <h3 className="font-semibold text-on-surface">{step.title}</h3>
            <p className="text-sm text-on-surface-variant">{step.body}</p>
            {step.to && (
              <Link to={step.to} className="mt-auto pt-2 text-sm font-semibold text-primary hover:underline">
                {step.action}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </Panel>
  )
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  // `?preview=empty` forces the brand-new-tutor state so it can be reviewed
  // while the sample data has courses and subscribers.
  const [params] = useSearchParams()
  const forceEmpty = params.get('preview') === 'empty'

  const { data, error, loading, reload } = useAsync(
    () => Promise.all([getStudioOverview(), listMyCourses()]).then(([overview, courses]) => ({ ...overview, courses })),
    []
  )

  const isNew = forceEmpty || (data && data.courses.length === 0 && data.stats.subscribers === 0)

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName(user?.name)}`}
        description={isNew ? 'This is your tutor studio. Here’s how to get going.' : 'Here’s how your courses are doing this month.'}
        actions={<QuickActions />}
      />

      {loading && <OverviewSkeleton />}
      {error && <ErrorState error={error} onRetry={reload} title="Your studio overview didn’t load" />}

      {data && isNew && <GettingStarted />}

      {data && !isNew && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile icon={Users} label="Supporters" value={formatCount(data.stats.subscribers)} detail="Paying you each month" />
            <StatTile
              icon={Wallet}
              label="Earnings this month"
              value={<span className="text-tertiary-container">{formatXaf(data.stats.earningsXaf)}</span>}
              detail={<EarningsChange current={data.stats.earningsXaf} previous={data.stats.earningsLastMonthXaf} />}
            />
            <StatTile icon={Eye} label="Course views" value={formatCount(data.stats.views)} detail={`Across ${data.courses.length} courses`} />
            <StatTile icon={Star} label="Average rating" value={`${data.stats.rating.toFixed(1)} / 5`} detail="From student reviews" />
          </div>

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <Panel>
              <h2 className="text-lg font-semibold text-on-surface">Recent activity</h2>
              {data.activity.length === 0 ? (
                <p className="mt-4 text-on-surface-variant">No activity yet. New follows, comments and support will appear here.</p>
              ) : (
                <ul className="mt-4 divide-y divide-outline-variant/60">
                  {data.activity.map((item) => {
                    const Icon = ACTIVITY_ICONS[item.type] ?? Heart
                    return (
                      <li key={item.id} className="flex items-start gap-3 py-3">
                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-container-low text-primary">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-on-surface">{item.text}</p>
                          <p className="text-sm text-on-surface-variant">{formatRelative(item.at)}</p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </Panel>

            <Panel>
              <h2 className="text-lg font-semibold text-on-surface">Top courses</h2>
              <ul className="mt-4 space-y-3">
                {[...data.courses]
                  .sort((a, b) => b.viewsCount - a.viewsCount)
                  .slice(0, 3)
                  .map((course) => (
                    <li key={course.id}>
                      <Link to={`/dashboard/courses/${course.id}/edit`} className="block rounded-lg p-2 -mx-2 hover:bg-surface-container-low">
                        <p className="line-clamp-2 text-sm font-medium text-on-surface">{course.title}</p>
                        <p className="mt-1 text-xs text-on-surface-variant">
                          {formatCount(course.viewsCount)} views, {formatCount(course.likesCount)} likes
                        </p>
                      </Link>
                    </li>
                  ))}
              </ul>
              <Link to="/dashboard/courses" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
                Manage all courses
              </Link>
            </Panel>
          </div>
        </div>
      )}
    </>
  )
}
