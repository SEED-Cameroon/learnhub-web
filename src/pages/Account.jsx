import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, CreditCard, Heart, LayoutDashboard, PencilLine, Users } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useAsync } from '@/hooks/useAsync'
import { listFollowing, listLikedCourses } from '@/services/me'
import { Button } from '@/components/ui/button'
import Avatar from '@/components/common/Avatar'
import Container from '@/components/common/Container'
import CourseCard from '@/components/common/CourseCard'
import { CardGridSkeleton, EmptyState, ErrorState, Skeleton } from '@/components/common/States'
import TutorRow from '@/components/account/TutorRow'

const TABS = [
  { id: 'following', label: 'Following' },
  { id: 'liked', label: 'Liked courses' },
]

function FollowingPanel() {
  const { data, error, loading, reload } = useAsync(listFollowing)

  if (loading) {
    return (
      <ul className="grid gap-3 md:grid-cols-2" role="status" aria-label="Loading">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="flex items-center gap-4 rounded-xl bg-surface-container-lowest p-4 elevation-1">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </li>
        ))}
      </ul>
    )
  }
  if (error) return <ErrorState error={error} onRetry={reload} title="Your followed tutors didn’t load" />
  if (!data.length) {
    return (
      <EmptyState
        icon={Users}
        title="You’re not following any tutors yet"
        action={
          <Button asChild className="h-auto rounded-full px-6 py-2.5 shadow-none">
            <Link to="/tutors">Find tutors</Link>
          </Button>
        }
      >
        Follow tutors to see their new courses first.
      </EmptyState>
    )
  }
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {data.map((tutor) => (
        <TutorRow key={tutor.id} tutor={tutor} />
      ))}
    </ul>
  )
}

function LikedPanel() {
  const { data, error, loading, reload } = useAsync(listLikedCourses)
  const grid = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'

  if (loading) return <CardGridSkeleton count={3} className={grid} />
  if (error) return <ErrorState error={error} onRetry={reload} title="Your liked courses didn’t load" />
  if (!data.length) {
    return (
      <EmptyState
        icon={Heart}
        title="No liked courses yet"
        action={
          <Button asChild className="h-auto rounded-full px-6 py-2.5 shadow-none">
            <Link to="/courses">Browse courses</Link>
          </Button>
        }
      >
        Like a course to keep it here for later.
      </EmptyState>
    )
  }
  return (
    <div className={grid}>
      {data.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}

export default function Account() {
  const { user } = useAuth()
  const [active, setActive] = useState(TABS[0].id)
  const tabRefs = useRef({})
  const isTutor = user?.role === 'tutor'

  // Arrow / Home / End keys move between tabs (WAI-ARIA tabs pattern).
  const onTabKeyDown = (event) => {
    const index = TABS.findIndex((t) => t.id === active)
    const moves = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: TABS.length - 1 }
    if (!(event.key in moves)) return
    event.preventDefault()
    const next = TABS[(moves[event.key] + TABS.length) % TABS.length]
    setActive(next.id)
    tabRefs.current[next.id]?.focus()
  }

  const shortcut = isTutor
    ? { to: '/dashboard', icon: LayoutDashboard, title: 'Tutor studio', text: 'Manage your courses, earnings and public profile.' }
    : { to: '/account/subscriptions', icon: CreditCard, title: 'My subscriptions', text: 'See and manage the tutors you support.' }

  return (
    <Container className="py-10 md:py-12">
      <section className="flex flex-col gap-6 rounded-xl bg-surface-container-lowest p-6 elevation-1 md:flex-row md:items-center md:p-8">
        <Avatar name={user?.name} src={user?.avatarUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">{user?.name}</h1>
          <p className="mt-1 truncate text-on-surface-variant">{user?.email}</p>
          <p className="mt-2 inline-flex rounded-full bg-surface-container px-2.5 py-0.5 text-xs font-semibold capitalize text-on-surface-variant">
            {user?.role}
          </p>
        </div>
        <Button asChild variant="outline" className="h-auto self-start rounded-full px-5 py-2.5 md:self-center">
          <Link to="/account/settings">
            <PencilLine aria-hidden="true" />
            Edit profile
          </Link>
        </Button>
      </section>

      <Link
        to={shortcut.to}
        className="group mt-4 flex items-center gap-4 rounded-xl border border-outline-variant bg-surface-container-low px-5 py-4 hover:border-primary/40 hover:bg-surface-container"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary-container/30 text-secondary">
          <shortcut.icon className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-on-surface">{shortcut.title}</span>
          <span className="block text-sm text-on-surface-variant">{shortcut.text}</span>
        </span>
        <ChevronRight className="size-5 text-on-surface-variant transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>

      <div className="mt-10">
        <div role="tablist" aria-label="Your activity" className="flex gap-6 border-b border-outline-variant">
          {TABS.map((tab) => {
            const selected = tab.id === active
            return (
              <button
                key={tab.id}
                ref={(el) => (tabRefs.current[tab.id] = el)}
                id={`tab-${tab.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                onKeyDown={onTabKeyDown}
                className={
                  selected
                    ? '-mb-px border-b-2 border-primary pb-3 text-base font-bold text-primary'
                    : '-mb-px border-b-2 border-transparent pb-3 text-base text-on-surface-variant hover:text-primary'
                }
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {TABS.map((tab) => (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={tab.id !== active}
            tabIndex={0}
            className="pt-6 focus-visible:outline-none"
          >
            {tab.id === active && (tab.id === 'following' ? <FollowingPanel /> : <LikedPanel />)}
          </div>
        ))}
      </div>
    </Container>
  )
}
