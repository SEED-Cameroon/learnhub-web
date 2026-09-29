import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HandCoins, MapPin, Search, Smartphone, TrendingUp, Wallet } from 'lucide-react'
import heroImage from '../assets/hero.jpg'
import { Button } from '@/components/ui/button'
import Avatar from '@/components/common/Avatar'
import Container from '@/components/common/Container'
import CourseCard from '@/components/common/CourseCard'
import CourseThumbnail from '@/components/common/CourseThumbnail'
import { CardGridSkeleton, ErrorState } from '@/components/common/States'
import TutorCard from '@/components/tutors/TutorCard'
import SectionHeading from '@/components/public/SectionHeading'
import FilterChips from '@/components/public/FilterChips'
import { useAsync } from '@/hooks/useAsync'
import { listCourses } from '@/services/courses'
import { listTutors } from '@/services/tutors'
import { CATEGORIES } from '@/data/mock'

const POPULAR_SEARCHES = ['GCE maths', 'HTML and CSS', 'Bilingualism test', 'Excel', 'Bookkeeping']

const FEATURES = [
  {
    title: 'Tutors who know your syllabus',
    description:
      'GCE, Baccalauréat, university and job skills, taught by Cameroonian teachers who have sat the same exams and work in the same industries.',
    Icon: MapPin,
  },
  {
    title: 'Free to watch, yours to support',
    description:
      'Every lesson is free. If a tutor helps you, support them each month with MTN Mobile Money or Orange Money.',
    Icon: HandCoins,
  },
  {
    title: 'Made for your phone',
    description: 'Short lessons that load on mobile data, and comments where you can ask the tutor directly.',
    Icon: Smartphone,
  },
]

const COURSE_GRID = 'grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-4'
const TUTOR_GRID = 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'
const SAMPLE_COURSE = { category: 'Mathematics' }

function HeroSearch() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const go = (query) => navigate(query ? `/courses?q=${encodeURIComponent(query)}` : '/courses')

  return (
    <div className="rise-in" style={{ '--d': '160ms' }}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          go(q.trim())
        }}
        className="flex items-center gap-2 rounded-full bg-surface-container-lowest p-1.5 pl-5 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.5)]"
      >
        <Search className="size-5 shrink-0 text-outline" aria-hidden="true" />
        <label htmlFor="hero-search" className="sr-only">
          Search courses
        </label>
        <input
          id="hero-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="What do you want to learn?"
          className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-on-surface outline-none placeholder:text-outline focus-visible:outline-none"
        />
        <Button
          type="submit"
          className="h-auto shrink-0 rounded-full bg-secondary-container px-5 py-3 text-sm font-semibold text-on-secondary-container shadow-none hover:bg-secondary-container/85 sm:px-7"
        >
          Search
        </Button>
      </form>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-primary-fixed-dim">Popular:</span>
        {POPULAR_SEARCHES.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => go(term)}
            className="rounded-full border border-white/20 px-3 py-1 text-primary-fixed transition-colors hover:border-white/60 hover:text-white"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Photo framed by small pieces of the real product, entering one after another. */
function HeroStage() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:mr-0">
      <div className="rise-in overflow-hidden rounded-[28px] ring-1 ring-white/15" style={{ '--d': '80ms' }}>
        <img
          src={heroImage}
          alt="Students working through a LearnHub lesson together on a tablet"
          className="aspect-[4/3.4] w-full object-cover"
        />
      </div>

      {/* Mobile Money support notice */}
      <div
        className="rise-in absolute -top-5 right-3 flex items-center gap-3 rounded-2xl bg-surface-container-lowest px-4 py-3 text-on-surface shadow-xl sm:-right-6"
        style={{ '--d': '420ms' }}
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-tertiary-fixed text-tertiary-container">
          <Wallet className="size-[18px]" aria-hidden="true" />
        </span>
        <div className="text-sm leading-tight">
          <p className="font-semibold">Nfor Brenda supported Dr. Foning</p>
          <p className="text-on-surface-variant">
            <span className="font-semibold text-tertiary-container">2,000 XAF</span> a month · MTN MoMo
          </p>
        </div>
      </div>

      {/* Course being watched */}
      <div
        className="rise-in absolute -bottom-6 left-3 hidden w-72 items-center gap-3 rounded-2xl bg-surface-container-lowest p-2.5 pr-4 text-on-surface shadow-xl sm:flex md:-left-10"
        style={{ '--d': '600ms' }}
      >
        <div className="w-24 shrink-0 overflow-hidden rounded-xl">
          <CourseThumbnail course={SAMPLE_COURSE} compact />
        </div>
        <div className="min-w-0 text-sm leading-tight">
          <p className="line-clamp-2 font-semibold">Calculus for GCE A Level</p>
          <p className="mt-1 text-on-surface-variant">38.2k views · 6 lessons</p>
        </div>
      </div>

      {/* Followers */}
      <div
        className="rise-in absolute bottom-16 -right-2 hidden items-center gap-2.5 rounded-full bg-surface-container-lowest py-2 pl-2 pr-4 text-sm text-on-surface shadow-xl md:flex lg:-right-8"
        style={{ '--d': '780ms' }}
      >
        <span className="flex -space-x-2">
          {['Ekane Grace', 'Kamdem Paul', 'Achu Mirabel'].map((n) => (
            <Avatar key={n} name={n} size="xs" className="ring-2 ring-surface-container-lowest" />
          ))}
        </span>
        <span>
          <span className="font-semibold">+37</span> followers this week
        </span>
      </div>
    </div>
  )
}

export default function Home() {
  const courses = useAsync(() => listCourses({ sort: 'popular' }), [])
  const tutors = useAsync(() => listTutors(), [])
  const [category, setCategory] = useState(null)

  const popular = useMemo(
    () => (courses.data ?? []).filter((c) => !category || c.category === category).slice(0, 4),
    [courses.data, category]
  )

  const featuredTutors = tutors.data
    ?.slice()
    .sort((a, b) => b.followersCount - a.followersCount)
    .slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-on-primary">
        <div className="thumb-dots pointer-events-none absolute inset-y-0 right-0 w-1/2 text-white opacity-[0.07] [mask-image:linear-gradient(to_left,black,transparent)]" />
        <Container className="relative grid grid-cols-1 items-center gap-14 pt-14 pb-20 md:pt-20 md:pb-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h1
              className="rise-in text-[40px] font-extrabold leading-[1.05] tracking-[-0.02em] text-balance md:text-[60px]"
              style={{ '--d': '0ms' }}
            >
              Learn from Cameroon’s best teachers. Free.
            </h1>
            <p className="rise-in mt-6 max-w-[34rem] text-lg leading-relaxed text-primary-fixed" style={{ '--d': '80ms' }}>
              Maths, coding, business and languages from local tutors who know your exams. Follow the ones who help you,
              and support them with Mobile Money.
            </p>
            <div className="mt-9">
              <HeroSearch />
            </div>
          </div>

          <div className="lg:col-span-6">
            <HeroStage />
          </div>
        </Container>
      </section>

      {/* Popular courses */}
      <section aria-labelledby="popular-heading">
        <Container className="py-16 md:py-24">
          <SectionHeading
            id="popular-heading"
            title="Popular courses"
            description="What students across Cameroon are watching this week."
            linkTo="/courses"
            linkLabel="All courses"
          />
          <div className="mb-8">
            <FilterChips
              label="Filter popular courses by subject"
              options={CATEGORIES}
              allLabel="All subjects"
              value={category}
              onChange={setCategory}
            />
          </div>
          {courses.loading ? (
            <CardGridSkeleton count={4} className={COURSE_GRID} />
          ) : courses.error ? (
            <ErrorState error={courses.error} onRetry={courses.reload} title="Courses didn’t load" />
          ) : popular.length === 0 ? (
            <p className="rounded-2xl bg-surface-container-low px-6 py-10 text-center text-on-surface-variant">
              No popular courses in {category} yet.{' '}
              <Link to={`/courses?category=${encodeURIComponent(category)}`} className="font-semibold text-primary hover:underline">
                See all {category} courses
              </Link>
            </p>
          ) : (
            <div className={COURSE_GRID}>
              {popular.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Why LearnHub */}
      <section id="why" aria-labelledby="why-heading" className="bg-surface-container-low">
        <Container className="grid grid-cols-1 gap-12 py-16 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="why-heading" className="text-3xl font-bold tracking-tight text-primary text-balance md:text-[40px] md:leading-[1.1]">
              Built for the way Cameroon learns
            </h2>
            <p className="mt-5 max-w-md text-lg text-on-surface-variant">
              Lessons from people who teach your syllabus, on the phone you already have, paid for by the students who
              choose to say thank you.
            </p>
            <Button asChild variant="outline" className="mt-8 h-auto rounded-full border-primary px-6 py-3 text-primary">
              <Link to="/about">How LearnHub works</Link>
            </Button>
          </div>

          <ul className="divide-y divide-outline-variant lg:col-span-6 lg:col-start-7">
            {FEATURES.map(({ title, description, Icon }) => (
              <li key={title} className="flex gap-5 py-7 first:pt-0 last:pb-0">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-secondary-container">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
                  <p className="mt-1.5 text-on-surface-variant">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Featured tutors */}
      <section aria-labelledby="tutors-heading">
        <Container className="py-16 md:py-24">
          <SectionHeading
            id="tutors-heading"
            title="Tutors to follow"
            description="The most-followed teachers on LearnHub right now."
            linkTo="/tutors"
            linkLabel="All tutors"
          />
          {tutors.loading ? (
            <CardGridSkeleton count={3} variant="tutor" className={TUTOR_GRID} />
          ) : tutors.error ? (
            <ErrorState error={tutors.error} onRetry={tutors.reload} title="Tutors didn’t load" />
          ) : (
            <div className={TUTOR_GRID}>
              {featuredTutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Tutor call to action */}
      <Container as="section" aria-labelledby="teach-heading" className="pb-16 md:pb-24">
        <div className="relative grid grid-cols-1 items-center gap-10 overflow-hidden rounded-[28px] bg-primary px-6 py-12 text-on-primary md:grid-cols-2 md:px-14 md:py-16">
          <div className="thumb-dots pointer-events-none absolute inset-0 text-white opacity-[0.06]" />
          <div className="relative">
            <h2 id="teach-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
              Teach what you know
            </h2>
            <p className="mt-4 max-w-md text-lg text-primary-fixed">
              Publish your first course in an afternoon. Students follow you, and supporters send you money every month
              through Mobile Money.
            </p>
            <Button
              asChild
              className="mt-8 h-auto rounded-full bg-secondary-container px-8 py-3 text-sm font-semibold text-on-secondary-container shadow-none hover:bg-secondary-container/85"
            >
              <Link to="/register?role=tutor">Become a tutor</Link>
            </Button>
          </div>

          {/* A glimpse of the tutor studio */}
          <div className="relative mx-auto w-full max-w-sm rounded-2xl bg-surface-container-lowest p-5 text-on-surface shadow-2xl md:mr-0" aria-hidden="true">
            <p className="text-sm text-on-surface-variant">Earnings this month</p>
            <p className="mt-1 text-3xl font-bold text-tertiary-container">318,000 XAF</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-tertiary-container">
              <TrendingUp className="size-4" />
              Up 15% on last month
            </p>
            <div className="mt-5 space-y-3 border-t border-outline-variant pt-4">
              {[
                ['Nfor Brenda', '2,000 XAF'],
                ['Fotso Arnaud', '5,000 XAF'],
                ['Achu Mirabel', '1,000 XAF'],
              ].map(([name, amount]) => (
                <div key={name} className="flex items-center gap-3 text-sm">
                  <Avatar name={name} size="xs" />
                  <span className="flex-1">{name}</span>
                  <span className="font-semibold">{amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
