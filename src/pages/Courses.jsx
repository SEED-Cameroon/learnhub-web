import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Container from '@/components/common/Container'
import PageHeader from '@/components/common/PageHeader'
import CourseCard from '@/components/common/CourseCard'
import { CardGridSkeleton, EmptyState, ErrorState } from '@/components/common/States'
import FilterChips from '@/components/public/FilterChips'
import SearchField from '@/components/public/SearchField'
import { useAsync } from '@/hooks/useAsync'
import { listCourses } from '@/services/courses'
import { CATEGORIES } from '@/data/mock'

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most watched' },
  { value: 'newest', label: 'Newest' },
  { value: 'liked', label: 'Most liked' },
]

const GRID = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

export default function Courses() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category')
  const sort = params.get('sort') ?? 'popular'
  const q = params.get('q') ?? ''

  // Typing updates the box immediately; the URL (and fetch) follow after a pause.
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

  const courses = useAsync(() => listCourses({ category, sort, q }), [category, sort, q])
  const hasFilters = Boolean(category || q)

  return (
    <Container className="py-10 md:py-14">
      <PageHeader
        title="Courses"
        description="Free lessons from Cameroonian tutors. Filter by subject or search for a topic."
      />

      <div className="mb-8 flex flex-col gap-4">
        <SearchField
          id="course-search"
          label="Search courses"
          value={query}
          onChange={setQuery}
          placeholder="Search for a topic, like calculus or Excel"
        />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <FilterChips
            label="Filter by subject"
            options={CATEGORIES}
            value={category}
            allLabel="All subjects"
            onChange={(value) => update({ category: value })}
          />
          <div className="flex shrink-0 items-center gap-2">
            <label htmlFor="course-sort" className="text-sm text-on-surface-variant">
              Sort by
            </label>
            <select
              id="course-sort"
              value={sort}
              onChange={(e) => update({ sort: e.target.value === 'popular' ? null : e.target.value })}
              className="h-10 rounded-full border border-outline-variant bg-surface-container-lowest px-4 text-sm text-on-surface"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {courses.loading ? (
        <CardGridSkeleton count={8} className={GRID} />
      ) : courses.error ? (
        <ErrorState error={courses.error} onRetry={courses.reload} title="Courses didn’t load" />
      ) : courses.data.length === 0 ? (
        <EmptyState
          title="No courses match"
          action={
            hasFilters && (
              <Button variant="outline" className="rounded-full" onClick={() => update({ category: null, q: null })}>
                Clear filters
              </Button>
            )
          }
        >
          {q
            ? `Nothing found for “${q}”${category ? ` in ${category}` : ''}.`
            : category
              ? `No ${category} courses yet.`
              : 'No courses have been published yet.'}{' '}
          Try another subject or a shorter search.
        </EmptyState>
      ) : (
        <>
          <p className="mb-4 text-sm text-on-surface-variant" aria-live="polite">
            {courses.data.length} {courses.data.length === 1 ? 'course' : 'courses'}
          </p>
          <div className={GRID}>
            {courses.data.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </>
      )}
    </Container>
  )
}
