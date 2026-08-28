import { Link } from 'react-router-dom'
import MaterialIcon from '../icons/MaterialIcon'
import TutorCard from './TutorCard'
import { MORE_TUTORS } from './tutorsData'

export default function AllTutors() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-12">
      <Link
        to="/mentors"
        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
      >
        <MaterialIcon name="arrow_back" className="text-base" />
        Back to Tutors
      </Link>

      <section className="mb-12">
        <h1 className="text-[32px] leading-[40px] font-bold text-primary mb-2">All Tutors</h1>
        <p className="text-base text-on-surface-variant">
          Explore more tutors and find the right mentor for your learning journey.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MORE_TUTORS.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </section>
    </div>
  )
}
