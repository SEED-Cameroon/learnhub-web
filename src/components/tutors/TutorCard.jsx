import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, Check, MapPin, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Avatar from '@/components/common/Avatar'
import { useAuthGate } from '@/hooks/useAuthGate'
import { setFollowing } from '@/services/tutors'
import { useOptimisticToggle } from '@/components/public/useOptimisticToggle'
import { usePendingAction } from '@/components/public/usePendingAction'
import { formatCount } from '@/lib/format'

const BANNER_TONES = ['bg-primary-container', 'bg-surface-tint', 'bg-tertiary-container']

export function bannerToneFor(id = '') {
  let hash = 0
  for (const ch of id) hash = (hash + ch.charCodeAt(0)) >>> 0
  return BANNER_TONES[hash % BANNER_TONES.length]
}

/** Channel card: who the tutor is, a strip of what they teach, and Follow. */
export default function TutorCard({ tutor }) {
  const { gate } = useAuthGate()
  const request = useCallback((next) => setFollowing(tutor.id, next), [tutor.id])
  const follow = useOptimisticToggle({
    initialOn: Boolean(tutor.isFollowing),
    initialCount: tutor.followersCount ?? 0,
    request,
  })

  // Finish a follow the guest started before logging in.
  usePendingAction({ follow: (p) => p.id === tutor.id && follow.toggle(true) })

  return (
    <article className="group relative flex flex-col rounded-2xl border border-outline-variant/70 bg-surface-container-lowest p-5 transition-[border-color,box-shadow] duration-300 hover:border-primary/30 hover:shadow-[0_18px_40px_-24px_rgb(0_35_111/0.45)] focus-within:border-primary/30">
      <div className="flex items-start gap-4">
        <Avatar name={tutor.name} src={tutor.avatarUrl} size="md" className="size-14 text-base" />
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1 font-semibold leading-snug text-on-surface">
            <Link
              to={`/tutors/${tutor.id}`}
              className="truncate after:absolute after:inset-0 after:rounded-2xl group-hover:text-primary focus-visible:outline-none"
            >
              {tutor.name}
            </Link>
            {tutor.verified && (
              <BadgeCheck className="size-[18px] shrink-0 fill-primary text-on-primary" aria-label="Verified tutor" />
            )}
          </h3>
          <p className="truncate text-sm text-on-surface-variant">{tutor.headline}</p>
          {tutor.city && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-outline">
              <MapPin className="size-3.5" aria-hidden="true" />
              {tutor.city}
            </p>
          )}
        </div>
      </div>

      {tutor.subjects?.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {tutor.subjects?.map((s) => (
            <span key={s} className="rounded-full bg-surface-container-low px-2.5 py-1 text-xs text-on-surface-variant">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm text-on-surface-variant">
          <span className="font-semibold text-on-surface">{formatCount(follow.count)}</span>{' '}
          {follow.count === 1 ? 'follower' : 'followers'}
          {tutor.coursesCount != null && (
            <>
              {' · '}
              <span className="font-semibold text-on-surface">{tutor.coursesCount}</span>{' '}
              {tutor.coursesCount === 1 ? 'course' : 'courses'}
            </>
          )}
        </p>

        {/* relative z-10 keeps the button above the card-wide link */}
        <Button
          type="button"
          size="sm"
          onClick={() => gate(() => follow.toggle(), { type: 'follow', id: tutor.id })}
          aria-pressed={follow.on}
          aria-label={`${follow.on ? 'Unfollow' : 'Follow'} ${tutor.name}`}
          className={
            follow.on
              ? 'relative z-10 rounded-full bg-surface-container px-3.5 text-on-surface-variant shadow-none hover:bg-surface-container-high hover:bg-surface-dim/60'
              : 'relative z-10 rounded-full border border-primary bg-transparent px-3.5 text-primary shadow-none hover:bg-primary hover:text-on-primary'
          }
        >
          {follow.on ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
          {follow.on ? 'Following' : 'Follow'}
        </Button>
      </div>
      {follow.error && (
        <p role="alert" className="relative z-10 mt-2 text-xs text-error">
          {follow.error}
        </p>
      )}
    </article>
  )
}
