import { Link } from 'react-router-dom'
import { BadgeCheck, Play } from 'lucide-react'
import Avatar from './Avatar'
import CourseThumbnail from './CourseThumbnail'
import { formatCount, formatDuration, formatRelative, formatXaf, totalMinutes } from '@/lib/format'

/**
 * Feed tile in the video-platform style: the thumbnail stands on its own,
 * details sit underneath without a box. Hover or keyboard focus zooms the
 * thumbnail and reveals what "open" does.
 */
export default function CourseCard({ course }) {
  const minutes = totalMinutes(course.lessons)
  const lessonCount = course.lessons?.length ?? 0

  return (
    <article className="group relative flex flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-surface-container">
        <CourseThumbnail
          course={course}
          className="transition-transform duration-500 ease-out group-hover:scale-[1.04] group-focus-within:scale-[1.04]"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-on-surface/0 transition-colors duration-300 group-hover:bg-on-surface/35 group-focus-within:bg-on-surface/35">
          <span className="flex translate-y-2 items-center gap-2 rounded-full bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-primary opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <Play className="size-4 fill-primary" aria-hidden="true" />
            {lessonCount ? `Watch · ${lessonCount} lessons` : 'Open course'}
          </span>
        </div>
        {course.priceXaf > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-secondary-container px-2.5 py-1 text-xs font-bold text-on-secondary-container">
            {formatXaf(course.priceXaf)}
          </span>
        )}
        {minutes > 0 && (
          <span className="absolute right-2.5 bottom-2.5 rounded-md bg-on-surface/85 px-1.5 py-0.5 text-xs font-semibold text-white">
            {formatDuration(minutes)}
          </span>
        )}
      </div>

      <div className="flex gap-3 pt-3.5">
        {course.tutor && <Avatar name={course.tutor.name} src={course.tutor.avatarUrl} size="sm" className="mt-0.5" />}
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-semibold leading-snug text-on-surface transition-colors group-hover:text-primary">
            <Link to={`/courses/${course.id}`} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
              {course.title}
            </Link>
          </h3>
          {course.tutor && (
            <p className="mt-1 flex items-center gap-1 text-sm text-on-surface-variant">
              <Link to={`/tutors/${course.tutor.id}`} className="relative z-10 truncate hover:text-primary">
                {course.tutor.name}
              </Link>
              {course.tutor.verified && <BadgeCheck className="size-4 shrink-0 fill-primary text-on-primary" aria-label="Verified tutor" />}
            </p>
          )}
          <p className="mt-0.5 text-sm text-outline">
            {formatCount(course.viewsCount ?? 0)} views
            {course.publishedAt && <> · {formatRelative(course.publishedAt)}</>}
            {!course.priceXaf && <> · <span className="font-semibold text-tertiary-container">Free</span></>}
          </p>
        </div>
      </div>
    </article>
  )
}
