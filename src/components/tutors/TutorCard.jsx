import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, Check, Users } from 'lucide-react'
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
    <article className="relative flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest elevation-1 interactive-card">
      <div className={`h-20 w-full ${bannerToneFor(tutor.id)}`} />
      <div className="relative flex flex-1 flex-col items-center px-6 pb-6 text-center -mt-10">
        <Avatar
          name={tutor.name}
          src={tutor.avatarUrl}
          size="lg"
          className="mb-4 ring-4 ring-surface-container-lowest"
        />

        <h3 className="flex items-center justify-center gap-1 text-lg font-semibold leading-snug text-primary">
          <Link to={`/tutors/${tutor.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {tutor.name}
          </Link>
          {tutor.verified && (
            <BadgeCheck className="size-5 shrink-0 fill-primary text-on-primary" aria-label="Verified tutor" />
          )}
        </h3>
        <p className="mt-1 text-sm text-on-surface-variant">{tutor.headline}</p>
        <p className="mt-2 mb-6 flex items-center gap-1.5 text-xs text-outline">
          <Users className="size-3.5" aria-hidden="true" />
          {formatCount(follow.count)} followers
        </p>

        {/* relative z-10 keeps the button above the card-wide link */}
        <Button
          type="button"
          onClick={() => gate(() => follow.toggle(), { type: 'follow', id: tutor.id })}
          aria-pressed={follow.on}
          aria-label={`${follow.on ? 'Unfollow' : 'Follow'} ${tutor.name}`}
          className={
            follow.on
              ? 'relative z-10 mt-auto h-auto w-full rounded-full border border-outline-variant bg-surface-container-low py-2.5 text-on-surface-variant shadow-none hover:bg-surface-container'
              : 'relative z-10 mt-auto h-auto w-full rounded-full bg-secondary-container py-2.5 text-on-secondary-container shadow-none hover:bg-secondary-container/85'
          }
        >
          {follow.on && <Check aria-hidden="true" />}
          {follow.on ? 'Following' : 'Follow'}
        </Button>
        {follow.error && (
          <p role="alert" className="relative z-10 mt-2 text-xs text-error">
            {follow.error}
          </p>
        )}
      </div>
    </article>
  )
}
