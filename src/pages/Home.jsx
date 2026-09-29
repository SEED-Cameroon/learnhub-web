import { Link } from 'react-router-dom'
import { HandCoins, MapPin, Smartphone } from 'lucide-react'
import heroImage from '../assets/hero.jpg'
import { Button } from '@/components/ui/button'
import Container from '@/components/common/Container'
import CourseCard from '@/components/common/CourseCard'
import { CardGridSkeleton, ErrorState } from '@/components/common/States'
import TutorCard from '@/components/tutors/TutorCard'
import SectionHeading from '@/components/public/SectionHeading'
import { useAsync } from '@/hooks/useAsync'
import { listCourses } from '@/services/courses'
import { listTutors } from '@/services/tutors'

const FEATURES = [
  {
    title: 'Tutors who know your syllabus',
    description:
      'GCE, Baccalauréat, university and job skills, taught by Cameroonian teachers who have sat the same exams and work in the same industries.',
    iconClass: 'bg-primary-fixed text-primary',
    Icon: MapPin,
  },
  {
    title: 'Free to watch, yours to support',
    description:
      'Courses are free to watch. If a tutor helps you, support them with MTN Mobile Money or Orange Money. You never pay to unlock a lesson.',
    iconClass: 'bg-secondary-fixed text-secondary',
    Icon: HandCoins,
  },
  {
    title: 'Made for your phone',
    description: 'Short lessons that load on mobile data. Pick up where you stopped and ask questions in the comments.',
    iconClass: 'bg-tertiary-fixed text-tertiary',
    Icon: Smartphone,
  },
]

const COURSE_GRID = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
const TUTOR_GRID = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'

export default function Home() {
  const courses = useAsync(() => listCourses({ sort: 'popular' }), [])
  const tutors = useAsync(() => listTutors(), [])

  const featuredTutors = tutors.data
    ?.slice()
    .sort((a, b) => b.followersCount - a.followersCount)
    .slice(0, 4)

  return (
    <div>
      {/* Hero */}
      <Container as="section" className="grid grid-cols-1 items-center gap-10 py-12 md:grid-cols-12 md:gap-6 md:py-20">
        <div className="flex flex-col gap-6 md:col-span-6">
          <h1 className="text-[32px] font-extrabold leading-[40px] tracking-tight text-on-surface md:text-[48px] md:leading-[56px]">
            Learn from Cameroon’s best teachers, for free.
          </h1>
          <p className="max-w-lg text-lg leading-7 text-on-surface-variant">
            Watch courses from local tutors in maths, coding, business and languages. Follow the ones you like and
            support them with Mobile Money.
          </p>

          <div className="mt-2 flex flex-wrap gap-4">
            <Button
              asChild
              className="h-auto rounded-full px-8 py-3 text-sm shadow-none hover:bg-primary hover:opacity-90"
            >
              <Link to="/courses">Browse courses</Link>
            </Button>
            <Button
              asChild
              className="h-auto rounded-full bg-secondary-container px-8 py-3 text-sm text-on-secondary-container shadow-none hover:bg-secondary-container hover:opacity-90"
            >
              <Link to="/register?role=tutor">Become a tutor</Link>
            </Button>
          </div>
        </div>

        <div className="relative h-[260px] overflow-hidden rounded-xl elevation-1 sm:h-[360px] md:col-span-6 md:h-[460px]">
          <img
            src={heroImage}
            alt="Students working through a lesson together on a tablet"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </Container>

      {/* Popular courses */}
      <section aria-labelledby="popular-heading">
        <Container className="pb-16 md:pb-24">
          <SectionHeading
            id="popular-heading"
            title="Popular courses"
            description="What students across Cameroon are watching this week."
            linkTo="/courses"
            linkLabel="All courses"
          />
          {courses.loading ? (
            <CardGridSkeleton count={4} className={COURSE_GRID} />
          ) : courses.error ? (
            <ErrorState error={courses.error} onRetry={courses.reload} title="Courses didn’t load" />
          ) : (
            <div className={COURSE_GRID}>
              {courses.data.slice(0, 4).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Why LearnHub */}
      <section id="why" aria-labelledby="why-heading" className="bg-surface-container-low">
        <Container className="py-16 md:py-24">
          <h2
            id="why-heading"
            className="mb-12 text-center text-2xl font-bold text-on-surface md:text-[32px] md:leading-10"
          >
            Why learn on LearnHub
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {FEATURES.map(({ title, description, iconClass, Icon }) => (
              <div
                key={title}
                className="flex flex-col items-start gap-4 rounded-xl bg-surface-container-lowest p-8 elevation-1"
              >
                <div className={`flex size-12 items-center justify-center rounded-full ${iconClass}`}>
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold leading-7 text-on-surface">{title}</h3>
                <p className="text-base text-on-surface-variant">{description}</p>
              </div>
            ))}
          </div>
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
            <CardGridSkeleton count={4} variant="tutor" className={TUTOR_GRID} />
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
      <Container as="section" className="pb-16 md:pb-24">
        <div className="flex flex-col items-start gap-6 rounded-xl bg-primary px-6 py-10 text-on-primary md:flex-row md:items-center md:justify-between md:px-12">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold md:text-3xl">Teach what you know</h2>
            <p className="mt-2 text-primary-fixed">
              Publish your first course in an afternoon. Students follow you, and supporters send you money every month
              through Mobile Money.
            </p>
          </div>
          <Button
            asChild
            className="h-auto shrink-0 rounded-full bg-secondary-container px-8 py-3 text-sm text-on-secondary-container shadow-none hover:bg-secondary-container hover:opacity-90"
          >
            <Link to="/register?role=tutor">Become a tutor</Link>
          </Button>
        </div>
      </Container>
    </div>
  )
}
