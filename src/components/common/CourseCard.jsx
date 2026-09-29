import { Link } from 'react-router-dom'
import { Heart, MessageCircle } from 'lucide-react'
import Avatar from './Avatar'
import CourseThumbnail from './CourseThumbnail'
import { formatCount, formatDuration, formatXaf, totalMinutes } from '@/lib/format'

/** Feed tile for a course: thumbnail, title, tutor, engagement. The whole card is one link. */
export default function CourseCard({ course }) {
  const minutes = totalMinutes(course.lessons)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest elevation-1 interactive-card">
      <div className="relative">
        <CourseThumbnail course={course} />
        {minutes > 0 && (
          <span className="absolute right-2 bottom-2 rounded bg-on-surface/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {formatDuration(minutes)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-on-surface">
          <Link to={`/courses/${course.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {course.title}
          </Link>
        </h3>

        {course.tutor && (
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Avatar name={course.tutor.name} src={course.tutor.avatarUrl} size="xs" />
            <span className="truncate">{course.tutor.name}</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between text-sm text-on-surface-variant">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Heart className="size-4" aria-hidden="true" />
              {formatCount(course.likesCount)}
              <span className="sr-only">likes</span>
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="size-4" aria-hidden="true" />
              {formatCount(course.commentsCount)}
              <span className="sr-only">comments</span>
            </span>
          </span>
          <span className={course.priceXaf ? 'font-semibold text-on-surface' : 'font-semibold text-tertiary-container'}>
            {formatXaf(course.priceXaf, { free: true })}
          </span>
        </div>
      </div>
    </article>
  )
}
