import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { UserRoundSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Container from '@/components/common/Container'
import { CardGridSkeleton, EmptyState, ErrorState } from '@/components/common/States'
import TutorCard from '@/components/tutors/TutorCard'
import FilterChips from '@/components/public/FilterChips'
import { BrowseHero, HeroSearchField, StickyFilterBar } from '@/components/public/BrowseHero'
import { useAsync } from '@/hooks/useAsync'
import { listTutors } from '@/services/tutors'
import { CATEGORIES } from '@/data/mock'

const GRID = 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'

export default function Tutors() {
  const [params, setParams] = useSearchParams()
  const subject = params.get('subject')
  const q = params.get('q') ?? ''

  const [query, setQuery] = useState(q)
  useEffect(() => setQuery(q), [q])
  useEffect(() => {
    if (query === q) return
    const id = setTimeout(() => update({ q: query.trim() || null }), 300)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const update = (changes) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (value == null || value === '') next.delete(key)
      else next.set(key, value)
    }
    setParams(next, { replace: true })
  }

  const tutors = useAsync(() => listTutors({ subject, q }), [subject, q])

  const count = tutors.data?.length

  return (
    <div>
      <BrowseHero
        title="Find a tutor"
        description="Follow tutors to see their new courses first. Support the ones who help you most."
        search={
          <HeroSearchField
            id="tutor-search"
            label="Search tutors"
            value={query}
            onChange={setQuery}
            placeholder="Search by name or subject"
          />
        }
      />

      <StickyFilterBar>
        <FilterChips
          label="Filter by subject"
          options={CATEGORIES}
          value={subject}
          allLabel="All subjects"
          onChange={(value) => update({ subject: value })}
        />
        <p className="shrink-0 text-sm text-on-surface-variant" aria-live="polite">
          {tutors.loading ? 'Loading…' : count != null && `${count} ${count === 1 ? 'tutor' : 'tutors'}`}
        </p>
      </StickyFilterBar>

      <Container className="py-10 md:py-12">
        {tutors.loading ? (
          <CardGridSkeleton count={8} variant="tutor" className={GRID} />
        ) : tutors.error ? (
          <ErrorState error={tutors.error} onRetry={tutors.reload} title="Tutors didn’t load" />
        ) : tutors.data.length === 0 ? (
          <EmptyState
            icon={UserRoundSearch}
            title="No tutors match"
            action={
              <Button variant="outline" className="rounded-full" onClick={() => update({ subject: null, q: null })}>
                Clear filters
              </Button>
            }
          >
            {q
              ? `Nobody found for “${q}”${subject ? ` in ${subject}` : ''}.`
              : subject
                ? `No ${subject} tutors yet.`
                : 'No tutors have joined yet.'}{' '}
            Try another subject or search by name.
          </EmptyState>
        ) : (
          <div className={GRID}>
            {tutors.data.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
