import { Label } from '@/components/ui/label'

/**
 * Label + control + hint/error, with the error wired to the control via
 * aria-describedby. `children` receives the props to spread on the control.
 */
export default function FormField({ id, label, hint, error, children }) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-on-surface">
        {label}
      </Label>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-sm text-on-surface-variant">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
