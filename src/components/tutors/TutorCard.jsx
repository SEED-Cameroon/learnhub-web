import { useState } from 'react'
import MaterialIcon from '../icons/MaterialIcon'
import { Button } from '@/components/ui/button'

export default function TutorCard({ tutor }) {
  const [followed, setFollowed] = useState(false)

  const followButtonClass = followed
    ? 'border border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface-variant'
    : tutor.verified
      ? 'bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-white'
      : 'border-2 border-primary text-primary bg-transparent hover:bg-surface-container-low hover:text-primary'

  return (
    <article className="bg-surface-container-lowest rounded-xl elevation-1 interactive-card overflow-hidden flex flex-col relative">
      <div className={`h-24 w-full ${tutor.topClass}`} />
      <div className="px-6 pb-6 flex-grow flex flex-col items-center text-center -mt-12 relative z-10">
        <img
          src={tutor.avatar}
          alt={`${tutor.name}'s profile photo`}
          className="w-24 h-24 rounded-full border-4 border-surface-container-lowest object-cover mb-4 shadow-sm"
        />
        <div className="flex items-center gap-1 mb-1">
          <h3 className="text-[24px] leading-8 font-semibold text-primary">{tutor.name}</h3>
          {tutor.verified && (
            <>
              <MaterialIcon name="verified" className="text-primary text-xl" fill />
              <span className="sr-only">Verified tutor</span>
            </>
          )}
        </div>
        <p className="text-base text-on-surface-variant mb-2">{tutor.subject}</p>
        <div className="flex items-center gap-2 text-outline text-xs mb-6">
          <MaterialIcon name="group" className="text-sm" />
          <span>{tutor.followers} Followers</span>
        </div>
        <Button
          type="button"
          onClick={() => setFollowed((prev) => !prev)}
          aria-pressed={followed}
          aria-label={`${followed ? 'Unfollow' : 'Follow'} ${tutor.name}`}
          className={`w-full mt-auto h-auto py-3 rounded-full shadow-none ${followButtonClass}`}
        >
          {followed && <MaterialIcon name="check" className="text-base" />}
          {followed ? 'Following' : 'Follow'}
        </Button>
      </div>
    </article>
  )
}
