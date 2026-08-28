import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.jpg'
import MaterialIcon from '../components/icons/MaterialIcon'

const FEATURES = [
  {
    title: 'Local Tutors',
    description:
      'Learn from experts who understand your context, local industries, and specific career challenges in Cameroon.',
    iconBgClass: 'bg-primary-fixed',
    iconColorClass: 'text-primary-fixed-dim',
    icon: 'person_raised_hand',
  },
  {
    title: 'Community First',
    description:
      'Support creators directly via seamless Mobile Money integration. Build the local creator economy together.',
    iconBgClass: 'bg-secondary-fixed',
    iconColorClass: 'text-secondary',
    icon: 'payments',
  },
  {
    title: 'Accessible Learning',
    description:
      'Watch high-quality course previews, join vibrant discussions, and learn at your own pace on any device.',
    iconBgClass: 'bg-tertiary-fixed',
    iconColorClass: 'text-tertiary',
    icon: 'devices',
  },
]

const FEATURED_EDUCATORS = [
  {
    name: 'Dr. Foning',
    subject: 'Advanced Mathematics',
    followers: '12k',
    verified: true,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Mbah Junior',
    subject: 'Web Development',
    followers: '8.5k',
    verified: true,
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    name: 'Amina Bello',
    subject: 'Business Studies',
    followers: '15k',
    verified: true,
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    name: 'Ngwa Eric',
    subject: 'Physics & Mechanics',
    followers: '5.2k',
    verified: true,
    avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-6 flex flex-col gap-6">
          <h1 className="text-[28px] leading-[36px] md:text-[48px] md:leading-[56px] font-extrabold tracking-tight text-on-surface">
            Empowering Cameroon&apos;s Future Through Knowledge.
          </h1>
          <p className="text-lg leading-7 text-on-surface-variant max-w-lg">
            Join the premier platform connecting local expertise with ambitious learners. Build
            your skills, advance your career, and support local creators.
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <Link
              to="/courses"
              className="bg-primary text-on-primary text-sm font-semibold tracking-wide px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Browse Courses
            </Link>
            <Link
              to="/register"
              className="bg-secondary-container text-on-secondary-container text-sm font-semibold tracking-wide px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Become a Tutor
            </Link>
          </div>
        </div>

        <div className="md:col-span-6 mt-8 md:mt-0 relative h-[400px] md:h-[500px] rounded-xl overflow-hidden elevation-1">
          <img
            src={heroImage}
            alt="LearnHub Cameroon tutors and students reviewing coursework together"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Why LearnHub Cameroon */}
      <section id="why" className="bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24">
          <h2 className="text-[32px] leading-[40px] font-bold text-center text-on-surface mb-12">
            Why LearnHub Cameroon?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-surface-container-lowest rounded-xl p-8 elevation-1 interactive-card flex flex-col items-start gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${feature.iconBgClass} ${feature.iconColorClass}`}
                >
                  <MaterialIcon name={feature.icon} fill />
                </div>
                <h3 className="text-[24px] leading-8 font-semibold text-on-surface">
                  {feature.title}
                </h3>
                <p className="text-base text-on-surface-variant">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Educators */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-[32px] leading-[40px] font-bold text-on-surface">
              Featured Educators
            </h2>
            <p className="mt-2 text-base text-on-surface-variant">
              Learn from our top-rated local experts.
            </p>
          </div>
          <Link
            to="/tutors/all"
            className="hidden md:flex text-primary text-sm font-semibold items-center gap-1 hover:underline whitespace-nowrap"
          >
            View All <MaterialIcon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURED_EDUCATORS.map((educator) => (
            <div
              key={educator.name}
              className="bg-surface-container-lowest rounded-xl overflow-hidden elevation-1 interactive-card flex flex-col relative"
            >
              <div className="h-24 bg-surface-variant w-full" />
              <div className="px-6 pb-6 pt-0 flex flex-col items-center text-center -mt-12 relative z-10">
                <div className="w-24 h-24 rounded-full border-4 border-surface-container-lowest overflow-hidden mb-4 relative">
                  <img
                    src={educator.avatar}
                    alt={educator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-[24px] leading-8 font-semibold text-on-surface flex items-center justify-center gap-1">
                  {educator.name}
                  {educator.verified && (
                    <MaterialIcon name="verified" className="text-primary text-[18px]" fill />
                  )}
                </h3>
                <p className="text-xs font-medium tracking-wide text-primary-container mt-1">
                  {educator.subject}
                </p>
                <p className="text-xs text-on-surface-variant mt-2">
                  {educator.followers} Followers
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/tutors/all"
            className="inline-block bg-surface-variant text-on-surface-variant text-sm font-semibold px-6 py-2 rounded-full hover:bg-surface-dim transition-colors"
          >
            View All Tutors
          </Link>
        </div>
      </section>
    </div>
  )
}
