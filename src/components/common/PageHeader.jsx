import { cn } from '@/lib/utils'

/** Page title block. `actions` sits to the right on wide screens, below on mobile. */
export default function PageHeader({ title, description, actions, className }) {
  return (
    <div className={cn('mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-base text-on-surface-variant md:text-lg">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </div>
  )
}
