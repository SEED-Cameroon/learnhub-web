import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function SearchField({ id, label, value, onChange, placeholder }) {
  return (
    <div className="relative w-full md:max-w-xl">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-outline"
        aria-hidden="true"
      />
      <Input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-full border-outline-variant bg-surface-container-lowest pl-12 pr-11 text-base md:text-base [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-on-surface-variant hover:bg-surface-container"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
