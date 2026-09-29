import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BadgeCheck, Check, HandCoins, LibraryBig, MapPin, UserRoundX, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Avatar from '@/components/common/Avatar'
import Container from '@/components/common/Container'
import CourseCard from '@/components/common/CourseCard'
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

const GRID = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'

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

  return (
    <section className="overflow-hidden rounded-xl bg-surface-container-lowest elevation-1">
      <div className={`h-28 md:h-40 ${bannerToneFor(tutor.id)}`} />
      <div className="flex flex-col gap-5 px-5 pb-6 md:flex-row md:items-end md:justify-between md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <Avatar
            name={tutor.name}
            src={tutor.avatarUrl}
            size="xl"
            className="-mt-14 ring-4 ring-surface-container-lowest"
          />
          <div className="min-w-0 md:pb-1">
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-primary md:text-3xl">
              {tutor.name}
              {tutor.verified && (
                <BadgeCheck className="size-6 shrink-0 fill-primary text-on-primary" aria-label="Verified tutor" />
              )}
            </h1>
            <p className="mt-1 text-on-surface-variant">{tutor.headline}</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-on-surface-variant">
              {tutor.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-4" aria-hidden="true" />
                  {tutor.city}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="size-4" aria-hidden="true" />
                {formatCount(follow.count)} followers
              </span>
              {tutor.coursesCount != null && (
                <span className="flex items-center gap-1">
                  <LibraryBig className="size-4" aria-hidden="true" />
                  {tutor.coursesCount} courses
                </span>
              )}
            </p>
          </div>
        </div>

        {isOwnProfile ? (
          <Button asChild variant="outline" className="h-auto rounded-full px-6 py-2.5">
            <Link to="/dashboard/profile">Edit profile</Link>
          </Button>
        ) : (
          <div className="flex flex-col gap-2 md:items-end">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                aria-pressed={follow.on}
                onClick={() => gate(() => follow.toggle(), { type: 'follow', id: tutor.id })}
                className={
                  follow.on
                    ? 'h-auto rounded-full border border-outline-variant bg-surface-container-low px-6 py-2.5 text-on-surface-variant shadow-none hover:bg-surface-container'
                    : 'h-auto rounded-full px-6 py-2.5 shadow-none'
                }
              >
                {follow.on && <Check aria-hidden="true" />}
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

  return (
    <section aria-labelledby="tutor-courses-heading" className="mt-12">
      <h2 id="tutor-courses-heading" className="mb-6 text-xl font-bold text-on-surface md:text-2xl">
        Courses by {tutor.name}
      </h2>
      {courses.loading ? (
        <CardGridSkeleton count={3} className={GRID} />
      ) : courses.error ? (
        <ErrorState error={courses.error} onRetry={courses.reload} title="Courses didn’t load" />
      ) : courses.data.length === 0 ? (
        <EmptyState icon={LibraryBig} title="No courses published yet">
          Follow {tutor.name} to see their first course when it’s published.
        </EmptyState>
      ) : (
        <div className={GRID}>
          {courses.data.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  )
}

export default function TutorProfile() {
  const { id } = useParams()
  const tutor = useAsync(() => getTutor(id), [id])

  if (tutor.loading) {
    return (
      <Container className="py-8 md:py-10">
        <div role="status" aria-label="Loading tutor">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="mt-8 h-24 w-full max-w-2xl" />
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
    <Container className="py-8 md:py-10">
      <ProfileHeader tutor={t} />

      {t.bio && (
        <section aria-labelledby="about-heading" className="mt-10 max-w-3xl">
          <h2 id="about-heading" className="mb-3 text-xl font-bold text-on-surface">
            About
          </h2>
          <p className="whitespace-pre-line text-lg leading-8 text-on-surface-variant">{t.bio}</p>
          {t.subjects?.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Subjects">
              {t.subjects.map((s) => (
                <li key={s}>
                  <Link
                    to={`/courses?category=${encodeURIComponent(s)}`}
                    className="inline-block rounded-full bg-primary-fixed px-3 py-1 text-sm font-medium text-primary hover:bg-primary-fixed-dim"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <TutorCourses tutor={t} />
    </Container>
  )
}
