import { useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MaterialIcon from '@/components/icons/MaterialIcon'
import TutorCard from '@/components/tutors/TutorCard'
import { CATEGORIES, FEATURED_TUTORS } from '@/components/tutors/tutorsData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function matchesCategory(subject, category) {
  if (category === 'All Subjects') return true
  const subjectLower = subject.toLowerCase()
  const keywords = category
    .toLowerCase()
    .split(/[\s&]+/)
    .filter(Boolean)
  return keywords.some((keyword) => subjectLower.includes(keyword))
}

function Tutors() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0])
  const [searchQuery, setSearchQuery] = useState('')
  const searchId = useId()

  const filteredTutors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return FEATURED_TUTORS.filter((tutor) => {
      const matchesQuery =
        query === '' ||
        tutor.name.toLowerCase().includes(query) ||
        tutor.subject.toLowerCase().includes(query)
      return matchesQuery && matchesCategory(tutor.subject, selectedCategory)
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-12">
      {/* Header */}
      <section className="mb-10 text-center md:text-left">
        <h1 className="text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] font-extrabold tracking-tight text-primary mb-3">
          Find Your Mentor
        </h1>
        <p className="text-base text-on-surface-variant mb-6 max-w-xl mx-auto md:mx-0">
          Search, filter, and connect with Cameroon&apos;s top-rated tutors.
        </p>
        <div className="max-w-2xl mx-auto md:mx-0 relative">
          <MaterialIcon
            name="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-outline"
          />
          <label htmlFor={searchId} className="sr-only">
            Search tutors by subject, name, or skill
          </label>
          <Input
            id={searchId}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject, name, or skill..."
            className="h-auto rounded-full py-4 pl-12 pr-12 text-lg border-outline-variant hover:border-outline focus-visible:border-primary focus-visible:ring-primary-container shadow-sm"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 size-8 text-outline hover:text-on-surface-variant hover:bg-transparent"
            >
              <MaterialIcon name="close" className="text-lg" />
            </Button>
          )}
        </div>
      </section>

      {/* Category filters */}
      <section className="mb-12 overflow-x-auto pb-4 hide-scrollbar">
        <div role="group" aria-label="Filter tutors by subject" className="flex gap-4 min-w-max">
          {CATEGORIES.map((category) => {
            const isSelected = category === selectedCategory
            return (
              <Button
                key={category}
                type="button"
                variant={isSelected ? 'default' : 'outline'}
                aria-pressed={isSelected}
                onClick={() => setSelectedCategory(category)}
                className={
                  isSelected
                    ? 'h-auto px-6 py-2 rounded-full shadow-sm hover:-translate-y-0.5 hover:bg-primary'
                    : 'h-auto px-6 py-2 rounded-full shadow-none hover:bg-surface-container-low hover:text-on-surface-variant hover:-translate-y-0.5'
                }
              >
                {category}
              </Button>
            )
          })}
        </div>
      </section>

      {/* Tutor cards */}
      {filteredTutors.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </section>
      ) : (
        <section className="flex flex-col items-center text-center py-16 px-6 bg-surface-container-low rounded-xl">
          <MaterialIcon name="search_off" className="text-4xl text-outline mb-4" />
          <h2 className="text-lg font-semibold text-on-surface mb-1">
            No tutors match &ldquo;{searchQuery || selectedCategory}&rdquo;
          </h2>
          <p className="text-sm text-on-surface-variant max-w-sm">
            Try a different subject or search term — we&apos;re onboarding new tutors every week.
          </p>
        </section>
      )}

      <div className="mt-12 flex justify-center">
        <Button
          asChild
          variant="outline"
          className="h-auto border-2 border-primary text-primary px-8 py-3 rounded-full shadow-sm hover:bg-surface-container-low hover:text-primary"
        >
          <Link to="/tutors/all">View All Tutors</Link>
        </Button>
      </div>
    </div>
  )
}

export default Tutors
