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
      {Array.from({ length: count }, (_, i) =>
        variant === 'course' ? (
          <div key={i}>
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <div className="flex gap-3 pt-3.5">
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2.5 pt-1">
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-3.5 w-1/2" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
            </div>
          </div>
        ) : (
          <div key={i} className="rounded-2xl border border-outline-variant/70 bg-surface-container-lowest p-5">
            <div className="flex gap-4">
              <Skeleton className="size-14 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2.5 pt-1.5">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3.5 w-1/2" />
              </div>
            </div>
            <div className="mt-5 space-y-2">
              {[0, 1].map((n) => (
                <Skeleton key={n} className="h-[61px] rounded-xl" />
              ))}
            </div>
            <div className="mt-5 flex justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>
        )
      )}
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
