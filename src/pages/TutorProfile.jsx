import { useCallback, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BadgeCheck, Check, HandCoins, LibraryBig, Plus, UserRoundX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Avatar from '@/components/common/Avatar'
import Container from '@/components/common/Container'
import CourseCard from '@/components/common/CourseCard'
import { categoryArt } from '@/components/common/CourseThumbnail'
import { CardGridSkeleton, EmptyState, ErrorState, Skeleton } from '@/components/common/States'
import { bannerToneFor } from '@/components/tutors/TutorCard'
import { useOptimisticToggle } from '@/components/public/useOptimisticToggle'
import { usePendingAction } from '@/components/public/usePendingAction'
import { useAuth } from '@/context/AuthContext'
import { useAsync } from '@/hooks/useAsync'
import { useAuthGate } from '@/hooks/useAuthGate'
import { getTutor, setFollowing } from '@/services/tutors'
import { listCourses } from '@/services/courses'
import { formatCount } from '@/lib/format'

const GRID = 'grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3'

function ProfileHeader({ tutor }) {
  const { user } = useAuth()
  const { gate } = useAuthGate()
  const request = useCallback((next) => setFollowing(tutor.id, next), [tutor.id])
  const follow = useOptimisticToggle({
    initialOn: Boolean(tutor.isFollowing),
    initialCount: tutor.followersCount ?? 0,
    request,
  })
  usePendingAction({ follow: (p) => p.id === tutor.id && follow.toggle(true) })
  const isOwnProfile = user?.id === tutor.id
  const { Icon: SubjectIcon } = categoryArt(tutor.subjects?.[0])

  return (
    <section aria-labelledby="tutor-name">
      <div className="-mx-4 md:mx-0">
        <div className={`relative h-36 overflow-hidden sm:h-44 md:h-56 md:rounded-3xl ${bannerToneFor(tutor.id)}`}>
          <div className="thumb-dots absolute inset-0 text-white opacity-[0.12]" />
          <SubjectIcon
            className="absolute -bottom-10 right-6 size-56 text-white opacity-[0.12] md:right-16 md:size-72"
            strokeWidth={1}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
          <Avatar
            name={tutor.name}
            src={tutor.avatarUrl}
            size="xl"
            className="relative z-10 -mt-14 size-28 ring-[6px] ring-surface md:-mt-16 md:size-36 md:text-4xl"
          />
          <div className="min-w-0 md:pb-2">
            <h1
              id="tutor-name"
              className="flex items-center gap-2 text-[28px] font-bold leading-tight tracking-[-0.015em] text-on-surface md:text-[36px]"
            >
              {tutor.name}
              {tutor.verified && (
                <BadgeCheck className="size-7 shrink-0 fill-primary text-on-primary" aria-label="Verified tutor" />
              )}
            </h1>
            <p className="mt-1 text-lg text-on-surface-variant">{tutor.headline}</p>
            <p className="mt-1.5 text-sm text-on-surface-variant">
              {[
                tutor.city,
                `${formatCount(follow.count)} followers`,
                tutor.coursesCount != null && `${tutor.coursesCount} courses`,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
        </div>

        {isOwnProfile ? (
          <Button asChild variant="outline" className="h-auto rounded-full px-6 py-2.5 md:mb-2">
            <Link to="/dashboard/profile">Edit profile</Link>
          </Button>
        ) : (
          <div className="flex flex-col gap-2 md:mb-2 md:items-end">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                aria-pressed={follow.on}
                aria-label={`${follow.on ? 'Unfollow' : 'Follow'} ${tutor.name}`}
                onClick={() => gate(() => follow.toggle(), { type: 'follow', id: tutor.id })}
                className={
                  follow.on
                    ? 'h-auto rounded-full bg-surface-container px-6 py-2.5 text-on-surface-variant shadow-none hover:bg-surface-dim/60'
                    : 'h-auto rounded-full border border-primary bg-transparent px-6 py-2.5 text-primary shadow-none hover:bg-primary hover:text-on-primary'
                }
              >
                {follow.on ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
                {follow.on ? 'Following' : 'Follow'}
              </Button>
              <Button
                asChild
                className="h-auto rounded-full bg-secondary-container px-6 py-2.5 text-on-secondary-container shadow-none hover:bg-secondary-container/85"
              >
                <Link to={`/tutors/${tutor.id}/support`}>
                  <HandCoins aria-hidden="true" />
                  Support
                </Link>
              </Button>
            </div>
            {follow.error && (
              <p role="alert" className="text-sm text-error">
                {follow.error}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function TutorCourses({ tutor }) {
  const courses = useAsync(() => listCourses({ tutorId: tutor.id, sort: 'newest' }), [tutor.id])

  if (courses.loading) return <CardGridSkeleton count={3} className={GRID} />
  if (courses.error) return <ErrorState error={courses.error} onRetry={courses.reload} title="Courses didn’t load" />
  if (courses.data.length === 0) {
    return (
      <EmptyState icon={LibraryBig} title="No courses published yet">
        Follow {tutor.name} to see their first course when it’s published.
      </EmptyState>
    )
  }
  return (
    <div className={GRID}>
      {courses.data.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}

function TutorAbout({ tutor }) {
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <h2 className="text-xl font-bold text-on-surface">About {tutor.name}</h2>
        <p className="mt-3 whitespace-pre-line text-lg leading-8 text-on-surface-variant">
          {tutor.bio || `${tutor.name} hasn’t written a bio yet.`}
        </p>
        {tutor.subjects?.length > 0 && (
          <>
            <h3 className="mt-8 text-sm font-semibold text-on-surface">Teaches</h3>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Subjects">
              {tutor.subjects.map((s) => (
                <li key={s}>
                  <Link
                    to={`/courses?category=${encodeURIComponent(s)}`}
                    className="inline-block rounded-full bg-primary-fixed px-3.5 py-1.5 text-sm font-medium text-primary hover:bg-primary-fixed-dim"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <aside aria-labelledby="support-card-heading" className="lg:col-span-4 lg:col-start-9">
        <div className="rounded-2xl bg-primary p-6 text-on-primary">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container">
            <HandCoins className="size-5" aria-hidden="true" />
          </span>
          <h2 id="support-card-heading" className="mt-4 text-lg font-semibold">
            Support this tutor
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-primary-fixed">
            Send {tutor.name} a monthly amount from 500 XAF with MTN Mobile Money or Orange Money. Their courses stay
            free for everyone, and you can cancel at any time.
          </p>
          <Button
            asChild
            className="mt-5 h-auto w-full rounded-full bg-secondary-container py-3 text-on-secondary-container shadow-none hover:bg-secondary-container/85"
          >
            <Link to={`/tutors/${tutor.id}/support`}>Choose an amount</Link>
          </Button>
        </div>
      </aside>
    </div>
  )
}

const TABS = [
  { id: 'courses', label: 'Courses' },
  { id: 'about', label: 'About' },
]

function ProfileTabs({ tutor }) {
  const [active, setActive] = useState('courses')
  const refs = useRef({})

  const onKeyDown = (e) => {
    const i = TABS.findIndex((t) => t.id === active)
    let next = null
    if (e.key === 'ArrowRight') next = TABS[(i + 1) % TABS.length]
    if (e.key === 'ArrowLeft') next = TABS[(i - 1 + TABS.length) % TABS.length]
    if (e.key === 'Home') next = TABS[0]
    if (e.key === 'End') next = TABS[TABS.length - 1]
    if (!next) return
    e.preventDefault()
    setActive(next.id)
    refs.current[next.id]?.focus()
  }

  return (
    <div className="mt-8">
      <div role="tablist" aria-label={`${tutor.name}’s channel`} className="flex gap-6 border-b border-outline-variant md:px-8">
        {TABS.map((tab) => {
          const selected = tab.id === active
          return (
            <button
              key={tab.id}
              ref={(el) => (refs.current[tab.id] = el)}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={onKeyDown}
              className={
                selected
                  ? '-mb-px border-b-2 border-primary px-1 py-3 font-semibold text-primary'
                  : '-mb-px border-b-2 border-transparent px-1 py-3 text-on-surface-variant hover:text-on-surface'
              }
            >
              {tab.label}
              {tab.id === 'courses' && tutor.coursesCount != null && (
                <span className="ml-1.5 text-sm font-normal text-outline">{tutor.coursesCount}</span>
              )}
            </button>
          )
        })}
      </div>

      {TABS.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== active}
          tabIndex={0}
          className="pt-8 focus-visible:outline-none md:px-8"
        >
          {tab.id === 'courses' ? <TutorCourses tutor={tutor} /> : <TutorAbout tutor={tutor} />}
        </div>
      ))}
    </div>
  )
}

export default function TutorProfile() {
  const { id } = useParams()
  const tutor = useAsync(() => getTutor(id), [id])

  if (tutor.loading) {
    return (
      <Container className="py-8 md:py-10">
        <div role="status" aria-label="Loading tutor">
          <Skeleton className="h-44 w-full rounded-3xl md:h-56" />
          <div className="flex items-end gap-6 md:px-8">
            <Skeleton className="relative z-10 -mt-14 size-28 rounded-full ring-[6px] ring-surface md:size-36" />
            <div className="flex-1 space-y-3 pb-2">
              <Skeleton className="h-8 w-1/2 max-w-sm" />
              <Skeleton className="h-4 w-1/3 max-w-xs" />
            </div>
          </div>
        </div>
      </Container>
    )
  }

  if (tutor.error) {
    return (
      <Container className="py-16">
        {tutor.error.status === 404 ? (
          <EmptyState
            icon={UserRoundX}
            title="This tutor doesn’t exist"
            action={
              <Button asChild className="rounded-full shadow-none">
                <Link to="/tutors">Find a tutor</Link>
              </Button>
            }
          >
            The profile may have been removed, or the link is wrong.
          </EmptyState>
        ) : (
          <ErrorState error={tutor.error} onRetry={tutor.reload} title="This profile didn’t load" />
        )}
      </Container>
    )
  }

  const t = tutor.data

  return (
    <Container className="pt-0 pb-16 md:pt-8 md:pb-24">
      <ProfileHeader tutor={t} />
      <ProfileTabs tutor={t} />
    </Container>
  )
}
