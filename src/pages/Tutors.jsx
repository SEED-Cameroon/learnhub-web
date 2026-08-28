import { useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MaterialIcon from '@/components/icons/MaterialIcon'
import TutorCard from '@/components/tutors/TutorCard'
import { CATEGORIES, FEATURED_TUTORS } from '@/components/tutors/tutorsData'

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
          <input
            id={searchId}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject, name, or skill..."
            className="w-full bg-surface-container-lowest border border-outline-variant hover:border-outline focus:border-primary rounded-full py-4 pl-12 pr-12 text-lg text-on-surface focus:ring-2 focus:ring-primary-container outline-none transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <MaterialIcon name="close" className="text-lg" />
            </button>
          )}
        </div>
      </section>

      {/* Category filters */}
      <section className="mb-12 overflow-x-auto pb-4 hide-scrollbar">
        <div role="group" aria-label="Filter tutors by subject" className="flex gap-4 min-w-max">
          {CATEGORIES.map((category) => {
            const isSelected = category === selectedCategory
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedCategory(category)}
                className={
                  isSelected
                    ? 'bg-primary text-on-primary text-sm font-semibold px-6 py-2 rounded-full shadow-sm transition-colors duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
                    : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant text-sm font-semibold px-6 py-2 rounded-full transition-colors duration-200 hover:bg-surface-container-low hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
                }
              >
                {category}
              </button>
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
        <Link
          to="/tutors/all"
          className="border-2 border-primary text-primary text-sm font-semibold px-8 py-3 rounded-full shadow-sm transition-colors duration-200 hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          View All Tutors
        </Link>
      </div>
    </div>
  )
}

export default Tutors
