import { cn } from '@/lib/utils'

const TONES = {
  active: 'bg-tertiary-fixed/60 text-tertiary-container',
  published: 'bg-tertiary-fixed/60 text-tertiary-container',
  paid: 'bg-tertiary-fixed/60 text-tertiary-container',
  pending: 'bg-secondary-fixed text-on-secondary-container',
  draft: 'bg-surface-container text-on-surface-variant',
  failed: 'bg-error-container text-on-error-container',
  cancelled: 'bg-surface-container text-on-surface-variant',
}

const LABELS = {
  active: 'Active',
  published: 'Published',
  paid: 'Paid',
  pending: 'Pending',
  draft: 'Draft',
  failed: 'Failed',
  cancelled: 'Cancelled',
}

export default function StatusBadge({ status, className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', TONES[status] ?? TONES.draft, className)}>
      {LABELS[status] ?? status}
    </span>
  )
}
