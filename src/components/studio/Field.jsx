import { cn } from '@/lib/utils'

/**
 * Label + control + help/error text. The control gets `id`, `aria-invalid`
 * and `aria-describedby` so errors are tied to their field, not just colour.
 */
export default function Field({ id, label, help, error, optional, className, children }) {
  const describedBy = [help && `${id}-help`, error && `${id}-error`].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-semibold text-on-surface">
        {label}
        {optional && <span className="ml-1 font-normal text-on-surface-variant">(optional)</span>}
      </label>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {help && !error && (
        <p id={`${id}-help`} className="text-sm text-on-surface-variant">
          {help}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-error">
          {error}
        </p>
      )}
    </div>
  )
}

export const selectClass =
  'border-input h-10 w-full rounded-md border bg-surface-container-lowest px-3 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm'

export function FormBanner({ tone = 'error', children }) {
  if (!children) return null
  const tones = {
    error: 'bg-error-container text-on-error-container',
    success: 'bg-tertiary-fixed/50 text-tertiary-container',
    info: 'bg-primary-fixed/50 text-primary',
  }
  return (
    <p role={tone === 'error' ? 'alert' : 'status'} className={cn('rounded-lg px-4 py-3 text-sm font-medium', tones[tone])}>
      {children}
    </p>
  )
}

export function Panel({ className, children, as: Tag = 'section' }) {
  return <Tag className={cn('rounded-xl border border-outline-variant/70 bg-surface-container-lowest p-5 md:p-6', className)}>{children}</Tag>
}
