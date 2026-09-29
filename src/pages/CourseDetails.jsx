import { useCallback, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BadgeCheck, Check, Clock, Eye, HandCoins, Heart, ListVideo, MessageCircle, PlayCircle } from 'lucide-react'
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
import { setFollowing } from '@/services/tutors'
import { cn } from '@/lib/utils'
import { formatCount, formatDate, formatDuration, formatRelative, formatXaf, totalMinutes } from '@/lib/format'

const COMMENT_MAX = 1000

function DetailSkeleton() {
  return (
    <Container className="py-8 md:py-10">
      <div role="status" aria-label="Loading course" className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    </Container>
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
      <Link to={`/tutors/${tutor.id}`} className="flex min-w-0 items-center gap-3 rounded-lg">
        <Avatar name={tutor.name} src={tutor.avatarUrl} size="md" />
        <div className="min-w-0">
          <p className="flex items-center gap-1 font-semibold text-on-surface">
            <span className="truncate">{tutor.name}</span>
            {tutor.verified && (
              <BadgeCheck className="size-4 shrink-0 fill-primary text-on-primary" aria-label="Verified tutor" />
            )}
          </p>
          <p className="text-sm text-on-surface-variant">{formatCount(follow.count)} followers</p>
        </div>
      </Link>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          aria-pressed={follow.on}
          onClick={() => gate(() => follow.toggle(), { type: 'follow', id: tutor.id })}
          className={
            follow.on
              ? 'h-auto rounded-full border border-outline-variant bg-surface-container-low px-5 py-2.5 text-on-surface-variant shadow-none hover:bg-surface-container'
              : 'h-auto rounded-full px-5 py-2.5 shadow-none'
          }
        >
          {follow.on && <Check aria-hidden="true" />}
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

function LikeButton({ course }) {
  const { gate } = useAuthGate()
  const request = useCallback((next) => setCourseLiked(course.id, next), [course.id])
  const like = useOptimisticToggle({ initialOn: Boolean(course.isLiked), initialCount: course.likesCount, request })
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
          'h-auto rounded-full px-5 py-2.5',
          like.on && 'border-primary bg-primary-fixed text-primary hover:bg-primary-fixed',
        )}
      >
        <Heart className={cn(like.on && 'fill-current')} aria-hidden="true" />
        {formatCount(like.count)}
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
        {formatCount(count)} comments
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
    <section aria-labelledby="more-heading" className="mt-16">
      <h2 id="more-heading" className="mb-6 text-xl font-bold text-on-surface">
        More from {course.tutor?.name}
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
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
  const minutes = totalMinutes(c.lessons)

  return (
    <Container className="py-8 md:py-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-x-10 lg:gap-y-0">
        <div className="min-w-0 lg:col-start-1">
          <div className="overflow-hidden rounded-xl elevation-1">
            <CourseThumbnail course={c} showPlay />
          </div>
          <p className="mt-2 text-xs text-outline">Video playback starts once lessons are uploaded to the server.</p>

          <h1 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-on-surface md:text-3xl">
            {c.title}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <Eye className="size-4" aria-hidden="true" />
              {formatCount(c.viewsCount)} views
            </span>
            <span>{c.category}</span>
            <span>{c.level}</span>
            <span>Published {formatDate(c.publishedAt)}</span>
          </p>

          <div className="mt-6 flex flex-col gap-5 border-y border-outline-variant py-5">
            {c.tutor && <TutorRow tutor={c.tutor} />}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <LikeButton course={c} />
            <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
              <MessageCircle className="size-4" aria-hidden="true" />
              {formatCount(c.commentsCount)} comments
            </span>
          </div>

          <div className="mt-6 rounded-xl bg-surface-container-low p-5">
            <h2 className="sr-only">About this course</h2>
            <p className="max-w-[70ch] whitespace-pre-line text-on-surface">{c.description}</p>
          </div>
        </div>

        <aside
          aria-labelledby="lessons-heading"
          className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start"
        >
          <div className="overflow-hidden rounded-xl bg-surface-container-lowest elevation-1">
            <div className="border-b border-outline-variant p-5">
              <h2 id="lessons-heading" className="text-lg font-bold text-on-surface">
                Lessons
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-on-surface-variant">
                <Clock className="size-4" aria-hidden="true" />
                {c.lessons.length} lessons, {formatDuration(minutes)} in total
              </p>
            </div>
            <ol className="max-h-[420px] overflow-y-auto p-2">
              {c.lessons.map((lesson, i) => (
                <li key={lesson.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm">
                  <span className="w-5 shrink-0 text-right tabular-nums text-outline">{i + 1}</span>
                  <PlayCircle className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="min-w-0 flex-1 text-on-surface">{lesson.title}</span>
                  <span className="shrink-0 tabular-nums text-on-surface-variant">{lesson.durationMin} min</span>
                </li>
              ))}
            </ol>
            <div className="border-t border-outline-variant p-5 text-sm">
              <p className="flex items-center justify-between">
                <span className="text-on-surface-variant">Price</span>
                <span
                  className={c.priceXaf ? 'font-semibold text-on-surface' : 'font-semibold text-tertiary-container'}
                >
                  {formatXaf(c.priceXaf, { free: true })}
                </span>
              </p>
            </div>
          </div>
        </aside>

        {/* After the lessons on mobile, under the description on desktop */}
        <div className="min-w-0 -mt-10 lg:col-start-1 lg:mt-0">
          <Comments courseId={c.id} initialCount={c.commentsCount} />
        </div>
      </div>

      <MoreFromTutor course={c} />
    </Container>
  )
}
