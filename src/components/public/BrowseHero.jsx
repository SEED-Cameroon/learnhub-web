import { Search, X } from 'lucide-react'
import Container from '@/components/common/Container'

/** Navy header band for the Courses and Tutors browse pages, with the page's search box. */
export function BrowseHero({ title, description, search }) {
  return (
    <section className="relative overflow-hidden bg-primary text-on-primary">
      <div className="thumb-dots pointer-events-none absolute inset-y-0 right-0 w-2/3 text-white opacity-[0.07] [mask-image:linear-gradient(to_left,black,transparent)]" />
      <Container className="relative py-12 md:py-16">
        <h1 className="text-[34px] font-extrabold leading-[1.1] tracking-[-0.02em] md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-lg text-primary-fixed">{description}</p>
        <div className="mt-8 max-w-2xl">{search}</div>
      </Container>
    </section>
  )
}

/** Large white search box used inside BrowseHero. */
export function HeroSearchField({ id, label, value, onChange, placeholder }) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-outline" aria-hidden="true" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-full bg-surface-container-lowest pl-13 pr-12 text-base text-on-surface shadow-[0_20px_50px_-24px_rgb(0_0_0/0.6)] outline-none placeholder:text-outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-container [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

/** Filter bar that stays under the site header while the results scroll. */
export function StickyFilterBar({ children }) {
  return (
    <div className="sticky top-16 z-30 border-b border-outline-variant/70 bg-surface/95 backdrop-blur">
      <Container className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">{children}</Container>
    </div>
  )
}
