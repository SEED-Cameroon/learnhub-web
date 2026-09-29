import { useCallback, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BadgeCheck, Check, Clock, HandCoins, Heart, Link2, ListVideo, MessageCircle, Play, Plus } from 'lucide-react'
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
import { USE_MOCKS } from '@/services/mock'
import { cn } from '@/lib/utils'
import { formatCount, formatDate, formatDuration, formatRelative, formatXaf, totalMinutes, countLabel } from '@/lib/format'

const COMMENT_MAX = 1000

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
 * The course only carries the tutor's name and avatar, so against the API the
 * row loads the full tutor for follower count and follow state. TutorRow
 * mounts once that's known, so its optimistic toggle starts from real values.
 */
function CourseTutor({ tutor }) {
  const full = useAsync(() => (USE_MOCKS ? Promise.resolve(tutor) : getTutor(tutor.id)), [tutor.id])

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

function Player({ course, lesson, index }) {
  if (course.previewVideoUrl) {
    return (
      <div className="overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
        <video
          controls
          preload="metadata"
          poster={course.thumbnailUrl || undefined}
          src={course.previewVideoUrl}
          className="aspect-video w-full bg-black"
        >
          Your browser can’t play this video.{' '}
          <a href={course.previewVideoUrl} className="underline">
            Open it directly
          </a>
          .
        </video>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary-container ring-1 ring-white/10">
      <CourseThumbnail course={course} showPlay />
      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
        {lesson ? (
          <p className="text-sm font-medium text-white">
            <span className="text-white/70">Lesson {index + 1} · </span>
            {lesson.title}
          </p>
        ) : (
          <span />
        )}
        <span className="hidden rounded-full bg-white/15 px-2.5 py-1 text-xs text-white/85 backdrop-blur sm:inline-flex">
          The tutor hasn’t added a video yet
        </span>
      </div>
    </div>
  )
}

/** Dark band that frames the player and, when the course has them, the lesson list. */
function Theatre({ course }) {
  const [current, setCurrent] = useState(0)
  const lessons = course.lessons ?? []
  const minutes = totalMinutes(lessons)
  const lesson = lessons[current]

  if (lessons.length === 0) {
    return (
      <section aria-label="Course player" className="bg-primary text-on-primary">
        <Container className="py-5 md:py-8">
          <div className="mx-auto max-w-5xl">
            <Player course={course} />
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section aria-label="Course player" className="bg-primary text-on-primary">
      <Container className="grid gap-5 py-5 md:py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6">
        <Player course={course} lesson={lesson} index={current} />

        <aside aria-labelledby="lessons-heading" className="lg:relative">
          <div className="flex flex-col overflow-hidden rounded-2xl bg-white/[0.06] ring-1 ring-white/10 lg:absolute lg:inset-0">
            <div className="border-b border-white/10 px-5 py-4">
              <h2 id="lessons-heading" className="font-semibold">
                Lessons
              </h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-primary-fixed-dim">
                <Clock className="size-4" aria-hidden="true" />
                {lessons.length} lessons · {formatDuration(minutes)}
              </p>
            </div>
            <ol className="max-h-[360px] flex-1 overflow-y-auto p-2 lg:max-h-none">
              {lessons.map((l, i) => {
                const active = i === current
                return (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => setCurrent(i)}
                      aria-current={active ? 'true' : undefined}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                        active ? 'bg-white text-primary' : 'text-primary-fixed hover:bg-white/10 hover:text-white',
                      )}
                    >
                      <span
                        className={cn(
                          'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums',
                          active ? 'bg-primary text-on-primary' : 'bg-white/10',
                        )}
                      >
                        {active ? <Play className="size-3 fill-current" aria-hidden="true" /> : i + 1}
                      </span>
                      <span className="min-w-0 flex-1 font-medium">{l.title}</span>
                      <span className={cn('shrink-0 tabular-nums', active ? 'text-primary/70' : 'text-primary-fixed-dim')}>
                        {l.durationMin} min
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
            <div className="flex items-center justify-between border-t border-white/10 px-5 py-3.5 text-sm">
              <span className="text-primary-fixed-dim">Price</span>
              <span className={course.priceXaf ? 'font-semibold text-white' : 'font-semibold text-tertiary-fixed'}>
                {formatXaf(course.priceXaf, { free: true })}
              </span>
            </div>
          </div>
        </aside>
      </Container>
    </section>
  )
}

export default function CourseDetails() {
  const { id } = useParams()
  const course = useAsync(() => getCourse(id), [id])

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
            <p className="mt-3 text-sm text-on-surface-variant">
              {[
                c.viewsCount != null && `${countLabel(c.viewsCount, "views")}`,
                c.publishedAt && `Published ${formatDate(c.publishedAt)}`,
                c.category,
                c.level,
                // Without a lessons panel, the price has nowhere else to show.
                !c.lessons?.length && formatXaf(c.priceXaf, { free: true }),
              ]
                .filter(Boolean)
                .join(' · ')}
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
