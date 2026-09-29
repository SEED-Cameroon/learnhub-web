import { AlertCircle, CheckCircle2 } from 'lucide-react'

/** Inline form-level banner for a save result. */
export default function FormStatus({ status, message }) {
  if (!message || (status !== 'error' && status !== 'success')) return null
  const isError = status === 'error'

  return (
    <p
      role={isError ? 'alert' : 'status'}
      className={
        isError
          ? 'flex items-start gap-2 rounded-lg bg-error-container px-3 py-2.5 text-sm text-on-error-container'
          : 'flex items-start gap-2 rounded-lg bg-tertiary-fixed/50 px-3 py-2.5 text-sm text-tertiary-container'
      }
    >
      {isError ? <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}
      {message}
    </p>
  )
}
