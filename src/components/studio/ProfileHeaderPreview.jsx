import { BadgeCheck, MapPin, Users } from 'lucide-react'
import Avatar from '@/components/common/Avatar'
import { formatCount } from '@/lib/format'

/** The top of the public tutor page, rendered from the profile form so tutors see changes before saving. */
export default function ProfileHeaderPreview({ profile }) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest elevation-1">
      <div className="h-28 bg-primary-container">
        {profile.bannerUrl && <img src={profile.bannerUrl} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="px-5 pb-5">
        <div className="-mt-10">
          <Avatar
            name={profile.name || 'Your name'}
            src={profile.avatarUrl}
            size="lg"
            className="border-4 border-surface-container-lowest"
          />
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <h3 className="text-xl font-bold text-primary">{profile.name || 'Your name'}</h3>
          {profile.verified && <BadgeCheck className="size-5 text-primary" aria-label="Verified tutor" />}
        </div>
        <p className="text-on-surface-variant">{profile.headline || 'Your headline'}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-on-surface-variant">
          {profile.city && (
            <span className="flex items-center gap-1">
              <MapPin className="size-4" aria-hidden="true" />
              {profile.city}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="size-4" aria-hidden="true" />
            {formatCount(profile.followersCount ?? 0)} followers
          </span>
        </div>
        {profile.subjects?.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {profile.subjects.map((s) => (
              <li key={s} className="rounded-full bg-surface-container px-3 py-1 text-xs font-medium text-on-surface-variant">
                {s}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 line-clamp-4 text-sm text-on-surface">{profile.bio || 'Your bio appears here.'}</p>
      </div>
    </div>
  )
}
