import { BookOpenText, Calculator, Code2, FlaskConical, GraduationCap, Languages, Landmark, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// Placeholder artwork until tutors can upload thumbnails: a palette tone and
// a subject glyph, so the grid still reads by subject at a glance.
const BY_CATEGORY = {
  Mathematics: { Icon: Calculator, tone: 'bg-primary-container text-primary-fixed-dim' },
  'Computer Science': { Icon: Code2, tone: 'bg-tertiary-container text-tertiary-fixed' },
  'Business & Finance': { Icon: Landmark, tone: 'bg-secondary text-secondary-fixed' },
  Languages: { Icon: Languages, tone: 'bg-surface-tint text-primary-fixed' },
  Sciences: { Icon: FlaskConical, tone: 'bg-tertiary text-tertiary-fixed' },
  'Exam Prep': { Icon: GraduationCap, tone: 'bg-primary text-primary-fixed-dim' },
}

export default function CourseThumbnail({ course, className, showPlay = false }) {
  const { Icon, tone } = BY_CATEGORY[course.category] ?? { Icon: BookOpenText, tone: 'bg-primary-container text-primary-fixed-dim' }

  if (course.thumbnailUrl) {
    return (
      <img
        src={course.thumbnailUrl}
        alt=""
        loading="lazy"
        className={cn('aspect-video w-full object-cover', className)}
      />
    )
  }

  return (
    <div className={cn('relative aspect-video w-full overflow-hidden', tone, className)} aria-hidden="true">
      <Icon className="absolute -right-4 -bottom-6 size-40 opacity-25" strokeWidth={1.25} />
      <Icon className="absolute left-5 top-5 size-8" strokeWidth={1.75} />
      {showPlay && (
        <PlayCircle className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-white/90" strokeWidth={1.25} />
      )}
    </div>
  )
}
