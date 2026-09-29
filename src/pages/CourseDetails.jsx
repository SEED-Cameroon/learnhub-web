import { useCallback, useMemo, useState } from 'react'
import { useSeo } from '@/hooks/useSeo'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import { Link, useParams } from 'react-router-dom'
import { BadgeCheck, Check, ChevronDown, CircleCheck, HandCoins, Heart, Link2, ListVideo, MessageCircle, Play, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Avatar from '@/components/common/Avatar'
import Container from '@/components/common/Container'
import CourseCard from '@/components/common/CourseCard'
import CourseThumbnail from '@/components/common/CourseThumbnail'
import { EmptyState, ErrorState, Skeleton } from '@/components/common/States'
import { useOptimisticToggle } from '@/components/public/useOptimisticToggle'
import { usePendingAction } from '@/components/public/usePendingAction'
import { useAuth } from '@/context/AuthContext'
import { useAsync } from '@/hooks/useAsync'
import { useAuthGate } from '@/hooks/useAuthGate'
import { addComment, getCourse, listComments, listCourses, setCourseLiked } from '@/services/courses'
import { getTutor, setFollowing } from '@/services/tutors'
import { cn } from '@/lib/utils'
import { formatCount, formatDate, formatDuration, formatRelative, formatXaf, countLabel, totalMinutes } from '@/lib/format'
import VideoPlayer from '@/components/course/VideoPlayer'

const COMMENT_MAX = 1000

/** schema.org Course, so search engines can show the course, tutor and price. */
function courseJsonLd(c) {
  const minutes = (c.lessons ?? []).reduce((sum, l) => sum + (l.durationMin || 0), 0)
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: c.title,
    description: c.description,
    url: `${SITE_URL}/courses/${c.id}`,
    ...(c.thumbnailUrl && { image: c.thumbnailUrl }),
    inLanguage: 'en',
    ...(c.level && { educationalLevel: c.level }),
    ...(c.outcomes?.length && { teaches: c.outcomes }),
    provider: { '@type': 'Organization', name: SITE_NAME, sameAs: SITE_URL },
    ...(c.tutor?.name && { instructor: { '@type': 'Person', name: c.tutor.name, url: `${SITE_URL}/tutors/${c.tutor.id}` } }),
    offers: { '@type': 'Offer', category: c.priceXaf ? 'Paid' : 'Free', price: c.priceXaf || 0, priceCurrency: 'XAF' },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      ...(minutes > 0 && { courseWorkload: `PT${minutes}M` }),
    },
  }
}

function DetailSkeleton() {
  return (
    <div role="status" aria-label="Loading course">
      <div className="bg-primary">
        <Container className="grid gap-6 py-6 md:py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="aspect-video w-full animate-pulse rounded-2xl bg-white/10" />
          <div className="hidden animate-pulse rounded-2xl bg-white/10 lg:block" />
        </Container>
      </div>
      <Container className="space-y-5 py-8">
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-14 w-full max-w-3xl" />
        <Skeleton className="h-24 w-full max-w-3xl" />
      </Container>
    </div>
  )
}

function TutorRow({ tutor }) {
  const { gate } = useAuthGate()
  const request = useCallback((next) => setFollowing(tutor.id, next), [tutor.id])
  const follow = useOptimisticToggle({
    initialOn: Boolean(tutor.isFollowing),
    initialCount: tutor.followersCount ?? 0,
    request,
  })
  usePendingAction({ follow: (p) => p.id === tutor.id && follow.toggle(true) })

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Link to={`/tutors/${tutor.id}`} className="group flex min-w-0 items-center gap-3 rounded-lg">
        <Avatar name={tutor.name} src={tutor.avatarUrl} size="md" />
        <div className="min-w-0">
          <p className="flex items-center gap-1 font-semibold text-on-surface">
            <span className="truncate group-hover:text-primary">{tutor.name}</span>
            {tutor.verified && (
              <BadgeCheck className="size-4 shrink-0 fill-primary text-on-primary" aria-label="Verified tutor" />
            )}
          </p>
          <p className="text-sm text-on-surface-variant">{countLabel(follow.count, "followers")}</p>
        </div>
      </Link>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          aria-pressed={follow.on}
          onClick={() => gate(() => follow.toggle(), { type: 'follow', id: tutor.id })}
          aria-label={`${follow.on ? 'Unfollow' : 'Follow'} ${tutor.name}`}
          className={
            follow.on
              ? 'h-auto rounded-full bg-surface-container px-5 py-2.5 text-on-surface-variant shadow-none hover:bg-surface-dim/60'
              : 'h-auto rounded-full border border-primary bg-transparent px-5 py-2.5 text-primary shadow-none hover:bg-primary hover:text-on-primary'
          }
        >
          {follow.on ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
          {follow.on ? 'Following' : 'Follow'}
        </Button>
        <Button
          asChild
          className="h-auto rounded-full bg-secondary-container px-5 py-2.5 text-on-secondary-container shadow-none hover:bg-secondary-container/85"
        >
          <Link to={`/tutors/${tutor.id}/support`}>
            <HandCoins aria-hidden="true" />
            Support
          </Link>
        </Button>
      </div>
      {follow.error && (
        <p role="alert" className="text-sm text-error sm:basis-full">
          {follow.error}
        </p>
      )}
    </div>
  )
}

/**
 * The course only carries the tutor's name and avatar, so the row loads the full tutor for follower count and follow state. TutorRow
 * mounts once that's known, so its optimistic toggle starts from real values.
 */
function CourseTutor({ tutor }) {
  const full = useAsync(() => getTutor(tutor.id), [tutor.id])

  if (full.loading) {
    return (
      <div className="flex items-center gap-3" role="status" aria-label="Loading tutor">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3.5 w-24" />
        </div>
      </div>
    )
  }
  return <TutorRow tutor={full.data ?? tutor} />
}

function LikeButton({ course }) {
  const { gate } = useAuthGate()
  const request = useCallback((next) => setCourseLiked(course.id, next), [course.id])
  const like = useOptimisticToggle({ initialOn: Boolean(course.likedByMe ?? course.isLiked), initialCount: course.likesCount ?? 0, request })
  usePendingAction({ like: () => like.toggle(true) })

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        aria-pressed={like.on}
        aria-label={`${like.on ? 'Unlike' : 'Like'} this course, ${like.count} likes`}
        onClick={() => gate(() => like.toggle(), { type: 'like' })}
        className={cn(
          'h-auto rounded-full border-outline-variant bg-surface-container-lowest px-5 py-2.5 shadow-none',
          like.on && 'border-primary bg-primary-fixed text-primary hover:bg-primary-fixed',
        )}
      >
        <Heart className={cn(like.on && 'fill-current')} aria-hidden="true" />
        {formatCount(like.count)}
        <span className="sr-only">likes</span>
      </Button>
      {like.error && (
        <p role="alert" className="mt-2 text-sm text-error">
          {like.error}
        </p>
      )}
    </div>
  )
}

function Comments({ courseId, initialCount }) {
  const { user } = useAuth()
  const { gate, isAuthenticated } = useAuthGate()
  const comments = useAsync(() => listComments(courseId), [courseId])
  const [body, setBody] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const text = body.trim()
    if (!text) return setError('Write something before posting.')
    if (text.length > COMMENT_MAX)
      return setError(`Comments can be up to ${COMMENT_MAX} characters. Yours is ${text.length}.`)
    setPending(true)
    setError('')
    try {
      const created = await addComment(courseId, text, { id: user.id, name: user.name })
      comments.setData((list = []) => [created, ...list])
      setBody('')
    } catch (err) {
      setError(err?.message || 'Your comment wasn’t posted. Try again.')
    } finally {
      setPending(false)
    }
  }

  const count = comments.data ? Math.max(initialCount, comments.data.length) : initialCount

  return (
    <section aria-labelledby="comments-heading" className="mt-10">
      <h2 id="comments-heading" className="mb-5 text-xl font-bold text-on-surface">
        {countLabel(count, "comments")}
      </h2>

      {isAuthenticated ? (
        <form onSubmit={submit} className="mb-8 flex gap-3">
          <Avatar name={user.name} src={user.avatarUrl} size="sm" className="mt-1" />
          <div className="flex-1">
            <label htmlFor="comment-body" className="sr-only">
              Add a comment
            </label>
            <Textarea
              id="comment-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Ask a question or say what helped you"
              rows={3}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'comment-error' : undefined}
              className="bg-surface-container-lowest"
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <p id="comment-error" role={error ? 'alert' : undefined} className="text-sm text-error">
                {error}
              </p>
              <Button
                type="submit"
                disabled={pending || !body.trim()}
                className="h-auto shrink-0 rounded-full px-5 py-2 shadow-none"
              >
                {pending ? 'Posting…' : 'Post comment'}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 flex flex-col items-start gap-3 rounded-xl bg-surface-container-low p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-on-surface-variant">Log in to ask a question or reply to other students.</p>
          <Button variant="outline" className="rounded-full" onClick={() => gate(() => {})}>
            Log in to comment
          </Button>
        </div>
      )}

      {comments.loading ? (
        <div className="space-y-5" role="status" aria-label="Loading comments">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.error ? (
        <ErrorState error={comments.error} onRetry={comments.reload} title="Comments didn’t load" />
      ) : comments.data.length === 0 ? (
        <p className="text-on-surface-variant">No comments yet. Start the conversation.</p>
      ) : (
        <ul className="space-y-6">
          {comments.data.map((c) => (
            <li key={c.id} className="flex gap-3">
              <Avatar name={c.author.name} src={c.author.avatarUrl} size="sm" />
              <div className="min-w-0">
                <p className="text-sm">
                  <span className="font-semibold text-on-surface">{c.author.name}</span>{' '}
                  <span className="text-on-surface-variant">{formatRelative(c.createdAt)}</span>
                </p>
                <p className="mt-1 whitespace-pre-line break-words text-on-surface">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function MoreFromTutor({ course }) {
  const more = useAsync(() => listCourses({ tutorId: course.tutorId }), [course.tutorId])
  const items = useMemo(() => (more.data ?? []).filter((c) => c.id !== course.id).slice(0, 3), [more.data, course.id])
  if (more.loading || more.error || items.length === 0) return null

  return (
    <section aria-labelledby="more-heading" className="mt-16 border-t border-outline-variant pt-12">
      <h2 id="more-heading" className="mb-6 text-2xl font-bold tracking-tight text-on-surface">
        More from {course.tutor?.name}
      </h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </section>
  )
}

function ShareButton({ title }) {
  const [status, setStatus] = useState('')

  const share = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setStatus('Link copied')
    } catch {
      setStatus('Copy failed. Copy the address bar instead.')
    }
    window.setTimeout(() => setStatus(''), 2500)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={share}
        aria-label={`Copy a link to ${title}`}
        className="h-auto rounded-full border-outline-variant bg-surface-container-lowest px-5 py-2.5 shadow-none"
      >
        {status === 'Link copied' ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />}
        Share
      </Button>
      <span role="status" aria-live="polite" className="text-sm text-on-surface-variant">
        {status}
      </span>
    </div>
  )
}

/** Desktop sidebar under the lessons: a quiet reminder that support is optional and never unlocks lessons. */
function SupportAside({ tutor }) {
  return (
    <aside aria-labelledby="support-aside-heading" className="hidden lg:block">
      <div className="sticky top-24 rounded-2xl border border-outline-variant/70 bg-surface-container-lowest p-6">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary-fixed text-secondary">
          <HandCoins className="size-5" aria-hidden="true" />
        </span>
        <h2 id="support-aside-heading" className="mt-4 text-lg font-semibold text-on-surface">
          Learning something useful?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
          Support {tutor.name} with a monthly amount from 500 XAF through MTN Mobile Money or Orange Money. Every lesson
          stays free either way.
        </p>
        <Button
          asChild
          className="mt-5 h-auto w-full rounded-full bg-secondary-container py-3 text-on-secondary-container shadow-none hover:bg-secondary-container/85"
        >
          <Link to={`/tutors/${tutor.id}/support`}>Support this tutor</Link>
        </Button>
        <Link to="/about#support" className="mt-3 block text-center text-sm text-primary hover:underline">
          How supporting works
        </Link>
      </div>
    </aside>
  )
}

function NoVideo({ course, label = 'No video yet' }) {
  // No video: show the course art without a play button, so nothing looks playable.
  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary-container ring-1 ring-white/10">
      <CourseThumbnail course={course} />
      <span className="absolute right-4 bottom-4 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur">
        {label}
      </span>
    </div>
  )
}

function LessonList({ lessons, current, onSelect }) {
  const minutes = totalMinutes(lessons)
  // On phones the outline starts collapsed so the course title stays near the video.
  const [open, setOpen] = useState(false)
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="lesson-list"
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left lg:pointer-events-none lg:border-b lg:border-white/10"
      >
        <span>
          <span id="lessons-heading" className="block font-semibold">
            Course outline
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-sm text-primary-fixed">
            <ListVideo className="size-4" aria-hidden="true" />
            {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
            {minutes > 0 && ` · ${formatDuration(minutes)}`}
          </span>
        </span>
        <ChevronDown className={cn('size-5 shrink-0 transition-transform lg:hidden', open && 'rotate-180')} aria-hidden="true" />
      </button>
      <ol
        id="lesson-list"
        className={cn('min-h-0 flex-1 overflow-y-auto border-t border-white/10 p-2 lg:block lg:border-t-0', !open && 'hidden')}
        aria-labelledby="lessons-heading"
      >
        {lessons.map((lesson, i) => {
          const active = i === current
          return (
            <li key={lesson.id}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                  active ? 'bg-surface-container-lowest text-on-surface' : 'text-primary-fixed hover:bg-white/10 hover:text-white'
                )}
              >
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    active ? 'bg-primary text-on-primary' : 'bg-white/10'
                  )}
                >
                  {active ? <Play className="size-3 fill-current" aria-hidden="true" /> : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 font-medium leading-6">{lesson.title}</span>
                  {!lesson.videoUrl && <span className={cn('text-xs', active ? 'text-outline' : 'text-primary-fixed-dim')}>No video yet</span>}
                </span>
                {lesson.durationMin > 0 && (
                  <span className={cn('shrink-0 text-xs leading-6', active ? 'text-on-surface-variant' : 'text-primary-fixed-dim')}>
                    {formatDuration(lesson.durationMin)}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/** Dark band framing the video, with the course outline beside it. */
function Theatre({ course }) {
  const lessons = course.lessons ?? []
  const [current, setCurrent] = useState(0)
  const lesson = lessons[current]
  const videoUrl = lesson ? lesson.videoUrl : course.previewVideoUrl
  const hasOutline = lessons.length > 0

  return (
    <section aria-label="Course video" className="bg-primary text-on-primary">
      <Container className={cn('grid gap-5 py-5 md:py-8', hasOutline && 'lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6')}>
        <div className={cn('min-w-0', !hasOutline && 'mx-auto w-full max-w-5xl')}>
          {videoUrl ? (
            <div className="overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
              <VideoPlayer url={videoUrl} title={lesson?.title ?? course.title} poster={course.thumbnailUrl} />
            </div>
          ) : (
            <NoVideo course={course} label={lesson ? 'This lesson has no video yet' : 'No video yet'} />
          )}
          {lesson && (
            <div className="mt-4">
              <p className="text-sm text-primary-fixed">
                Lesson {current + 1} of {lessons.length}
              </p>
              <h2 className="mt-0.5 text-lg font-semibold">{lesson.title}</h2>
              {lesson.summary && <p className="mt-1 max-w-[70ch] text-sm leading-relaxed text-primary-fixed">{lesson.summary}</p>}
              {lesson.videoCredit && <p className="mt-2 text-xs text-primary-fixed-dim">Video: {lesson.videoCredit}</p>}
            </div>
          )}
        </div>
        {hasOutline && (
          <aside aria-label="Course outline" className="lg:relative">
            <div className="lg:absolute lg:inset-0">
              <LessonList lessons={lessons} current={current} onSelect={setCurrent} />
            </div>
          </aside>
        )}
      </Container>
    </section>
  )
}

export default function CourseDetails() {
  const { id } = useParams()
  const course = useAsync(() => getCourse(id), [id])
  const seoCourse = course.data
  useSeo({
    title: seoCourse?.title ?? (course.error ? 'Course not found' : 'Course'),
    description: seoCourse?.description,
    image: seoCourse?.thumbnailUrl || undefined,
    noindex: Boolean(course.error),
    jsonLd: seoCourse && courseJsonLd(seoCourse),
  })

  if (course.loading) return <DetailSkeleton />

  if (course.error) {
    return (
      <Container className="py-16">
        {course.error.status === 404 ? (
          <EmptyState
            icon={ListVideo}
            title="This course doesn’t exist"
            action={
              <Button asChild className="rounded-full shadow-none">
                <Link to="/courses">Browse courses</Link>
              </Button>
            }
          >
            It may have been removed by the tutor, or the link is wrong.
          </EmptyState>
        ) : (
          <ErrorState error={course.error} onRetry={course.reload} title="This course didn’t load" />
        )}
      </Container>
    )
  }

  const c = course.data

  return (
    <div>
      <Theatre course={c} />

      <Container className="pt-8 pb-16 md:pt-10 md:pb-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6">
          <div className="min-w-0">
            <h1 className="text-[28px] font-bold leading-[1.15] tracking-[-0.015em] text-on-surface text-balance md:text-[36px]">
              {c.title}
            </h1>
            <p className="mt-3 flex flex-wrap gap-x-1.5 gap-y-1 text-sm text-on-surface-variant">
              {[
                c.publishedAt && `Published ${formatDate(c.publishedAt)}`,
                c.category,
                c.level,
                c.viewsCount > 0 && countLabel(c.viewsCount, 'views'),
                formatXaf(c.priceXaf, { free: true }),
              ]
                .filter(Boolean)
                .map((item, i, items) => (
                  <span key={item} className="whitespace-nowrap">
                    {item}
                    {i < items.length - 1 && <span aria-hidden="true"> ·</span>}
                  </span>
                ))}
            </p>

            <div className="mt-6 border-y border-outline-variant py-5">{c.tutor && <CourseTutor tutor={c.tutor} />}</div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <LikeButton course={c} />
              <ShareButton title={c.title} />
              <a
                href="#comments-heading"
                className="flex items-center gap-1.5 rounded-full px-3 py-2.5 text-sm text-on-surface-variant hover:text-primary"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                {countLabel(c.commentsCount, "comments")}
              </a>
            </div>

            {c.outcomes?.length > 0 && (
              <div className="mt-6 rounded-2xl border border-outline-variant/70 p-5 md:p-6">
                <h2 className="font-semibold text-on-surface">What you’ll learn</h2>
                <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {c.outcomes.map((o) => (
                    <li key={o} className="flex gap-2.5 text-sm leading-relaxed text-on-surface">
                      <CircleCheck className="mt-0.5 size-4 shrink-0 text-tertiary-container" aria-hidden="true" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 rounded-2xl bg-surface-container-low p-5 md:p-6">
              <h2 className="text-sm font-semibold text-on-surface">About this course</h2>
              <p className="mt-2 max-w-[70ch] whitespace-pre-line leading-relaxed text-on-surface">{c.description}</p>
            </div>

            <Comments courseId={c.id} initialCount={c.commentsCount} />
          </div>

          {c.tutor && <SupportAside tutor={c.tutor} />}
        </div>

        <MoreFromTutor course={c} />
      </Container>
    </div>
  )
}
