import { cn } from '@/lib/utils'

const TONES = [
  'bg-primary-container text-on-primary',
  'bg-surface-tint text-on-primary',
  'bg-tertiary-container text-tertiary-fixed',
  'bg-secondary-fixed text-on-secondary-container',
  'bg-primary-fixed text-primary',
]

const SIZES = {
  xs: 'size-7 text-[11px]',
  sm: 'size-9 text-xs',
  md: 'size-12 text-sm',
  lg: 'size-20 text-xl',
  xl: 'size-28 text-3xl',
}

function initials(name = '') {
  const words = name.replace(/^(Dr|Mme|Mr|Mrs|Prof)\.?\s+/i, '').split(/\s+/).filter(Boolean)
  return ((words[0]?.[0] ?? '') + (words[1]?.[0] ?? '')).toUpperCase() || '?'
}

function toneFor(name = '') {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return TONES[hash % TONES.length]
}

/** Photo when `src` is set, otherwise initials on a palette tone derived from the name. */
export default function Avatar({ name, src, size = 'md', className }) {
  const base = cn('inline-flex shrink-0 items-center justify-center rounded-full font-bold select-none', SIZES[size], className)

  if (src) {
    return <img src={src} alt={name} loading="lazy" className={cn(base, 'object-cover')} />
  }

  return (
    <span className={cn(base, toneFor(name))} role="img" aria-label={name}>
      {initials(name)}
    </span>
  )
}
