import { Link } from 'react-router-dom'

const FEATURES = [
  {
    title: 'Local Tutors',
    description:
      'Learn from experts who understand your context, local industries, and specific career challenges in Cameroon.',
    badgeClass: 'bg-purple-100 text-purple-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12Zm0 0c-4.142 0-7.5 2.239-7.5 5v1.5h15V17c0-2.761-3.358-5-7.5-5Z" />
      </svg>
    ),
  },
  {
    title: 'Community First',
    description:
      'Support creators directly via seamless Mobile Money integration. Build the local creator economy together.',
    badgeClass: 'bg-orange-100 text-orange-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75a4.5 4.5 0 0 0-9 0M12 11.25a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.5 7.5a3.75 3.75 0 0 0-6-3M4.5 18.75a3.75 3.75 0 0 1 6-3M18 8.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM6 8.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
      </svg>
    ),
  },
  {
    title: 'Accessible Learning',
    description:
      'Watch high-quality course previews, join vibrant discussions, and learn at your own pace on any device.',
    badgeClass: 'bg-teal-100 text-teal-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25a8.987 8.987 0 0 0-3-.512 8.966 8.966 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
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
    followers: '8.6k',
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
      <section className="bg-white dark:bg-slate-950 max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            Empowering Cameroon&apos;s Future Through Knowledge.
          </h1>
          <p className="mt-5 text-slate-600 dark:text-slate-400 max-w-lg">
            Join the premier platform connecting local expertise with ambitious learners. Build
            your skills, advance your career, and support local creators.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/courses"
              className="bg-[#123263] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0d2549] transition"
            >
              Browse Courses
            </Link>
            <Link
              to="/register"
              className="bg-[#f5a623] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#e0951a] transition"
            >
              Become a Tutor
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl bg-gradient-to-br from-[#123263] to-[#2f5aa8] p-8 shadow-lg overflow-hidden">
            <div className="flex -space-x-3">
              {FEATURED_EDUCATORS.slice(0, 3).map((educator) => (
                <img
                  key={educator.name}
                  src={educator.avatar}
                  alt={educator.name}
                  className="w-14 h-14 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <p className="mt-6 text-white/90 text-sm">
              Live cohorts running across Douala, Yaoundé & Buea
            </p>
            <div className="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full w-3/4 rounded-full bg-[#f5a623]" />
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-xl shadow-md px-5 py-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">Course completion</p>
            <p className="text-lg font-bold text-[#123263] dark:text-slate-100">92%</p>
          </div>
        </div>
      </section>

      {/* Why LearnHub Cameroon */}
      <section id="why" className="bg-[#f0f2ff] dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100">
            Why LearnHub Cameroon?
          </h2>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${feature.badgeClass}`}>
                  {feature.icon}
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Educators */}
      <section className="bg-white dark:bg-slate-950 max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Featured Educators
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Learn from our top-rated local experts.
            </p>
          </div>
          <Link
            to="/mentors/all"
            className="text-sm font-medium text-[#123263] dark:text-slate-100 hover:underline whitespace-nowrap"
          >
            View All &rarr;
          </Link>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_EDUCATORS.map((educator) => (
            <div
              key={educator.name}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm"
            >
              <div className="h-20 bg-[#eef0fb] dark:bg-slate-700" />
              <div className="px-6 pb-6 text-center">
                <img
                  src={educator.avatar}
                  alt={educator.name}
                  className="w-16 h-16 rounded-full mx-auto -mt-8 border-4 border-white dark:border-slate-800 object-cover"
                />
                <h3 className="mt-3 font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-1">
                  {educator.name}
                  {educator.verified && (
                    <span
                      title="Verified"
                      className="inline-flex w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] items-center justify-center"
                    >
                      &#10003;
                    </span>
                  )}
                </h3>
                <p className="text-sm font-medium text-[#f5a623]">{educator.subject}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {educator.followers} Followers
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
