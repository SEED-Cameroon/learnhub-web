import { useLocation, useSearchParams } from 'react-router-dom'
import { Check, HandCoins, MessagesSquare, PlaySquare, TrendingUp, Upload, UsersRound } from 'lucide-react'
import Avatar from '@/components/common/Avatar'
import CourseThumbnail from '@/components/common/CourseThumbnail'
import { COURSES, TUTORS } from '@/data/mock'
import { formatCount } from '@/lib/format'

// Brand panel beside the auth forms. Its message follows the page and, on
// sign-up, the role picked, so people see what the account is for.
const COPY = {
  login: {
    title: 'Pick up where you left off',
    body: 'Everything you follow is where you left it.',
    points: [
      { Icon: UsersRound, text: 'New courses from the tutors you follow' },
      { Icon: PlaySquare, text: 'The courses you liked, ready to rewatch' },
      { Icon: MessagesSquare, text: 'Replies to your questions in the comments' },
    ],
  },
  student: {
    title: 'Learn from tutors who know your exams',
    body: 'Free courses in maths, coding, business and languages, made in Cameroon.',
    points: [
      { Icon: PlaySquare, text: 'Every lesson is free to watch' },
      { Icon: UsersRound, text: 'Follow tutors to see their new courses first' },
      { Icon: MessagesSquare, text: 'Ask questions in the comments' },
    ],
  },
  tutor: {
    title: 'Teach what you know, and get supported for it',
    body: 'Students who learn from you can support you every month with Mobile Money.',
    points: [
      { Icon: Upload, text: 'Publish your first course in an afternoon' },
      { Icon: HandCoins, text: 'Receive monthly support through MTN or Orange' },
      { Icon: TrendingUp, text: 'See your views, followers and earnings in one place' },
    ],
  },
}

const tutorName = (id) => TUTORS.find((t) => t.id === id)?.name

function CourseStack() {
  const picks = ['c2', 'c1', 'c5'].map((id) => COURSES.find((c) => c.id === id))
  const tilt = ['-rotate-[8deg]', '', 'rotate-[8deg]']

  return (
    <div className="relative mx-auto flex h-60 w-full max-w-md items-end justify-center" aria-hidden="true">
      {picks.map((course, i) =>
        i === 1 ? (
          // Front card: the full course tile.
          <div key={course.id} className="absolute bottom-0 z-10 w-60 overflow-hidden rounded-2xl bg-surface-container-lowest shadow-2xl">
            <CourseThumbnail course={course} compact />
            <div className="p-3">
              <p className="line-clamp-1 text-sm font-semibold text-on-surface">{course.title}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-on-surface-variant">
                <Avatar name={tutorName(course.tutorId)} size="xs" className="size-5 text-[9px]" />
                <span className="truncate">{tutorName(course.tutorId)}</span>
                <span className="shrink-0">· {formatCount(course.viewsCount)} views</span>
              </p>
            </div>
          </div>
        ) : (
          // Back cards: thumbnails only, fanned out behind.
          <div
            key={course.id}
            className={`absolute bottom-10 w-48 overflow-hidden rounded-2xl opacity-90 shadow-xl ring-1 ring-white/10 ${tilt[i]} ${
              i === 0 ? 'left-2' : 'right-2'
            }`}
          >
            <CourseThumbnail course={course} compact />
          </div>
        )
      )}
    </div>
  )
}

function EarningsPreview() {
  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl bg-surface-container-lowest p-5 text-on-surface shadow-2xl" aria-hidden="true">
      <p className="text-sm text-on-surface-variant">Earnings this month</p>
      <p className="mt-1 text-3xl font-bold text-tertiary-container">318,000 XAF</p>
      <p className="mt-1 flex items-center gap-1 text-sm text-tertiary-container">
        <TrendingUp className="size-4" />
        Up 15% on last month
      </p>
      <div className="mt-5 space-y-3 border-t border-outline-variant pt-4">
        {[
          ['Nfor Brenda', '2,000 XAF', 'MTN'],
          ['Fotso Arnaud', '5,000 XAF', 'Orange'],
          ['Achu Mirabel', '1,000 XAF', 'MTN'],
        ].map(([name, amount, provider]) => (
          <div key={name} className="flex items-center gap-3 text-sm">
            <Avatar name={name} size="xs" />
            <span className="flex-1">{name}</span>
            <span className="text-xs text-outline">{provider}</span>
            <span className="font-semibold">{amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AuthAside() {
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const variant = pathname === '/login' ? 'login' : params.get('role') === 'tutor' ? 'tutor' : 'student'
  const copy = COPY[variant]

  return (
    <aside className="sticky top-0 hidden h-screen p-3 lg:block">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] bg-primary px-12 py-14 text-on-primary xl:px-16">
        <div className="thumb-dots pointer-events-none absolute inset-0 text-white opacity-[0.07]" />

        {/* key re-runs the entrance when the sign-up role changes */}
        <div key={variant} className="relative flex h-full flex-col">
          <h2 className="rise-in max-w-md text-[40px] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance">
            {copy.title}
          </h2>
          <p className="rise-in mt-4 max-w-md text-lg text-primary-fixed" style={{ '--d': '60ms' }}>
            {copy.body}
          </p>

          {copy.points && (
            <ul className="rise-in mt-8 space-y-3.5" style={{ '--d': '120ms' }}>
              {copy.points.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-primary-fixed">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-secondary-container">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          )}

          <div className="rise-in mt-auto pt-10" style={{ '--d': '200ms' }}>
            {variant === 'tutor' ? <EarningsPreview /> : <CourseStack />}
          </div>

          {variant === 'login' && (
            <p className="rise-in mt-10 flex items-center gap-2 text-sm text-primary-fixed-dim" style={{ '--d': '260ms' }}>
              <Check className="size-4 text-secondary-container" aria-hidden="true" />
              Courses stay free whether or not you support a tutor.
            </p>
          )}
        </div>
      </div>
    </aside>
  )
}
