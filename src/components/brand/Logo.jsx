import { cn } from '@/lib/utils'

/** The LearnHub mark: a white L with an amber play button, on navy. */
export function LogoMark({ className, title }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('size-8 shrink-0', className)} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <rect width="64" height="64" rx="15" fill="#00236f" />
      <g transform="translate(-1.5 0)">
        <path d="M17 13.5h10.5v27H47V51H17z" fill="#fff" />
        <path d="M33.6 15.4c0-1.6 1.7-2.5 3-1.7l12.6 8.1c1.2.8 1.2 2.6 0 3.4L36.6 33.3c-1.3.8-3-.1-3-1.7z" fill="#fea619" />
      </g>
    </svg>
  )
}

/** Mark + wordmark. `name` lets the studio say "LearnHub Studio". */
export default function Logo({ name = 'LearnHub Cameroon', className, markClassName }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 font-bold tracking-[-0.01em] text-primary', className)}>
      <LogoMark className={markClassName} />
      {name}
    </span>
  )
}
