import { cn } from '@/lib/utils'

/** Single-select chip row. `value` null means "All". Scrolls sideways on small screens. */
export default function FilterChips({ label, options, value, onChange, allLabel = 'All' }) {
  const items = [{ value: null, label: allLabel }, ...options.map((o) => ({ value: o, label: o }))]

  return (
    <div
      role="group"
      aria-label={label}
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 hide-scrollbar md:mx-0 md:flex-wrap md:px-0"
    >
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.label}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(item.value)}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              active
                ? 'border-primary bg-primary text-on-primary'
                : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary hover:text-primary',
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
