import { AlertCircle, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-md bg-surface-container', className)} aria-hidden="true" />
}

/** Placeholder grid matching CourseCard / TutorCard proportions. */
export function CardGridSkeleton({ count = 6, variant = 'course', className }) {
  return (
    <div className={className} role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-xl bg-surface-container-lowest elevation-1">
          {variant === 'course' ? (
            <>
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 p-6">
              <Skeleton className="size-24 rounded-full" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="mt-3 h-10 w-full rounded-full" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ icon: Icon = SearchX, title, children, action, className }) {
  return (
    <div className={cn('flex flex-col items-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest px-6 py-14 text-center', className)}>
      <Icon className="mb-4 size-10 text-outline" strokeWidth={1.5} aria-hidden="true" />
      <h2 className="text-lg font-semibold text-on-surface">{title}</h2>
      {children && <p className="mt-2 max-w-md text-on-surface-variant">{children}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function ErrorState({ error, onRetry, title = 'This didn’t load', className }) {
  return (
    <div role="alert" className={cn('flex flex-col items-center rounded-xl border border-error-container bg-error-container/40 px-6 py-12 text-center', className)}>
      <AlertCircle className="mb-4 size-10 text-error" strokeWidth={1.5} aria-hidden="true" />
      <h2 className="text-lg font-semibold text-on-surface">{title}</h2>
      <p className="mt-2 max-w-md text-on-surface-variant">
        {error?.message || 'Check your connection and try again.'}
      </p>
      {onRetry && (
        <Button variant="outline" className="mt-6 rounded-full" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
