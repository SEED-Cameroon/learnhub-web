import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

/** Section title with an optional "see all" link aligned to the right. */
export default function SectionHeading({ title, description, linkTo, linkLabel, id }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 id={id} className="text-2xl font-bold text-on-surface md:text-[32px] md:leading-10">
          {title}
        </h2>
        {description && <p className="mt-2 text-base text-on-surface-variant">{description}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="flex shrink-0 items-center gap-0.5 text-sm font-semibold text-primary hover:underline"
        >
          {linkLabel}
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
