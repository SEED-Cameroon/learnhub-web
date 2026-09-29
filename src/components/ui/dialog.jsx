import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close

function DialogContent({ className, children, ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-on-surface/50" />
      <DialogPrimitive.Content
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface-container-lowest p-6 shadow-lg',
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm text-on-surface-variant opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-primary">
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

function DialogTitle({ className, ...props }) {
  return <DialogPrimitive.Title className={cn('pr-8 text-lg font-semibold text-on-surface', className)} {...props} />
}

function DialogDescription({ className, ...props }) {
  return <DialogPrimitive.Description className={cn('mt-2 text-on-surface-variant', className)} {...props} />
}

function DialogFooter({ className, ...props }) {
  return <div className={cn('mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end', className)} {...props} />
}

export { Dialog, DialogTrigger, DialogClose, DialogContent, DialogTitle, DialogDescription, DialogFooter }
