import { BookOpenText, BrainCircuit, Calculator, Code2, FlaskConical, GraduationCap, Languages, Landmark, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// Placeholder artwork until tutors can upload thumbnails: a palette tone,
// a dot grid and a subject glyph, so the feed still reads by subject.
const BY_CATEGORY = {
  Mathematics: { Icon: Calculator, tone: 'bg-primary-container text-primary-fixed-dim' },
  'Computer Science': { Icon: Code2, tone: 'bg-tertiary-container text-tertiary-fixed' },
  'Artificial Intelligence': { Icon: BrainCircuit, tone: 'bg-on-surface text-secondary-container' },
  'Business & Finance': { Icon: Landmark, tone: 'bg-secondary text-secondary-fixed' },
  Languages: { Icon: Languages, tone: 'bg-surface-tint text-primary-fixed' },
  Sciences: { Icon: FlaskConical, tone: 'bg-tertiary text-tertiary-fixed' },
  'Exam Prep': { Icon: GraduationCap, tone: 'bg-primary text-primary-fixed-dim' },
}

export function categoryArt(category) {
  return BY_CATEGORY[category] ?? { Icon: BookOpenText, tone: 'bg-primary-container text-primary-fixed-dim' }
}

/** `compact` drops the small corner glyph for tiny tiles (tutor card strips, tables). */
export default function CourseThumbnail({ course, className, showPlay = false, compact = false }) {
  const { Icon, tone } = categoryArt(course.category)

  if (course.thumbnailUrl) {
    return <img src={course.thumbnailUrl} alt="" loading="lazy" className={cn('aspect-video w-full object-cover', className)} />
  }

  return (
    <div className={cn('relative aspect-video w-full overflow-hidden', tone, className)} aria-hidden="true">
      <div className="thumb-dots absolute inset-0 opacity-[0.18]" />
      <Icon
        className={cn('absolute opacity-30', compact ? '-right-2 -bottom-3 size-16' : '-right-5 -bottom-7 size-44')}
        strokeWidth={1.25}
      />
      {!compact && <Icon className="absolute left-4 top-4 size-7" strokeWidth={1.75} />}
      {showPlay && (
        <PlayCircle className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-white/90" strokeWidth={1.25} />
      )}
    </div>
  )
}
