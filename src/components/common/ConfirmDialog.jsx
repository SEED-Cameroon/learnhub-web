import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog'

/**
 * Confirmation step for destructive or financial actions.
 * `onConfirm` may return a promise; the dialog stays open and shows its error if it rejects.
 */
export default function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, cancelLabel = 'Keep it', onConfirm, destructive = true }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    setPending(true)
    setError('')
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (err) {
      setError(err?.message || 'That didn’t work. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !pending && (setError(''), onOpenChange(next))}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-error-container px-3 py-2 text-sm text-on-error-container">
            {error}
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" className="rounded-full" onClick={() => onOpenChange(false)} disabled={pending}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? 'destructive' : 'default'} className="rounded-full" onClick={handleConfirm} disabled={pending}>
            {pending ? 'Working…' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
