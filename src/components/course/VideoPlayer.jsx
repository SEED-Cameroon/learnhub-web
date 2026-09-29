import { youtubeId } from '@/lib/video'
import { cn } from '@/lib/utils'

/**
 * Plays a lesson or preview video: YouTube links are embedded (privacy-
 * enhanced mode, no cookies until play), anything else is treated as a
 * video file such as an upload on Cloudinary.
 */
export default function VideoPlayer({ url, title, poster, className }) {
  const id = youtubeId(url)

  if (id) {
    return (
      <iframe
        key={id}
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`}
        title={title || 'Lesson video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className={cn('aspect-video w-full bg-black', className)}
      />
    )
  }

  return (
    <video key={url} controls preload="metadata" poster={poster || undefined} src={url} className={cn('aspect-video w-full bg-black', className)}>
      Your browser can’t play this video.{' '}
      <a href={url} className="underline">
        Open it directly
      </a>
      .
    </video>
  )
}
