import { Link } from 'react-router-dom'
import { BadgeCheck } from 'lucide-react'
import Avatar from '@/components/common/Avatar'
import { formatCount } from '@/lib/format'

/** Compact followed-tutor row: avatar, name, headline, followers. The row is one link. */
export default function TutorRow({ tutor }) {
  return (
    <li className="relative flex items-center gap-4 rounded-xl bg-surface-container-lowest p-4 elevation-1 interactive-card">
      <Avatar name={tutor.name} src={tutor.avatarUrl} size="md" />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 font-semibold text-on-surface">
          <Link to={`/tutors/${tutor.id}`} className="truncate after:absolute after:inset-0 focus-visible:outline-none">
            {tutor.name}
          </Link>
          {tutor.verified && (
            <>
              <BadgeCheck className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="sr-only">Verified tutor</span>
            </>
          )}
        </p>
        <p className="truncate text-sm text-on-surface-variant">{tutor.headline}</p>
      </div>
      <span className="shrink-0 text-sm text-on-surface-variant">{formatCount(tutor.followersCount)} followers</span>
    </li>
  )
}
