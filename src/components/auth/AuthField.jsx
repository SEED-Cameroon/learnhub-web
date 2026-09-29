import { useState } from 'react'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const INPUT =
  'h-12 rounded-xl border-outline-variant bg-surface-container-lowest pl-11 text-base md:text-base focus-visible:border-primary focus-visible:ring-primary/25'

/** Label + icon input + hint/error, with the error tied to the input for screen readers. */
export function AuthField({ id, label, icon: Icon, error, hint, labelAside, className, children, ...inputProps }) {
  const describedBy = [error ? `${id}-error` : hint && `${id}-hint`].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id} className="text-sm font-semibold text-on-surface">
          {label}
        </Label>
        {labelAside}
      </div>
      <div className="relative">
        <Icon
          className={cn(
            'pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2',
            error ? 'text-error' : 'text-outline'
          )}
          aria-hidden="true"
        />
        {children ?? (
          <Input
            id={id}
            name={id}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={cn(INPUT, 'pr-4')}
            {...inputProps}
          />
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-sm text-error">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-xs text-on-surface-variant">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

/** Password input with show/hide and a Caps Lock warning. Use inside AuthField as its child. */
export function PasswordInput({ id, error, hint, describedBy: extraDescribedBy, ...inputProps }) {
  const [visible, setVisible] = useState(false)
  const [capsLock, setCapsLock] = useState(false)

  const checkCaps = (e) => setCapsLock(Boolean(e.getModifierState?.('CapsLock')))
  const describedBy =
    [error ? `${id}-error` : hint && `${id}-hint`, capsLock && `${id}-caps`, extraDescribedBy].filter(Boolean).join(' ') ||
    undefined

  return (
    <>
      <Input
        id={id}
        name={id}
        type={visible ? 'text' : 'password'}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        onKeyUp={checkCaps}
        onKeyDown={checkCaps}
        onBlur={(e) => {
          setCapsLock(false)
          inputProps.onBlur?.(e)
        }}
        className={cn(INPUT, 'pr-12')}
        {...inputProps}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
      >
        {visible ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
      </button>
      {capsLock && (
        <p id={`${id}-caps`} className="absolute -bottom-6 right-0 text-xs font-medium text-secondary">
          Caps Lock is on
        </p>
      )}
    </>
  )
}

/** Form-level message: server errors, or why the person was sent here. */
export function AuthBanner({ tone = 'error', children }) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'mb-6 flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm',
        tone === 'error' ? 'bg-error-container text-on-error-container' : 'bg-primary-fixed/60 text-primary'
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}

export function Spinner({ className }) {
  return (
    <span
      className={cn('inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent', className)}
      aria-hidden="true"
    />
  )
}
