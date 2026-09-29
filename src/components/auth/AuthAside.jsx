import { useLocation, useSearchParams } from 'react-router-dom'
import { Check, HandCoins, MessagesSquare, PlaySquare, TrendingUp, Upload, UsersRound, Wallet } from 'lucide-react'
import Avatar from '@/components/common/Avatar'
import CourseThumbnail from '@/components/common/CourseThumbnail'
import { useAsync } from '@/hooks/useAsync'
import { listCourses } from '@/services/courses'
import { countLabel } from '@/lib/format'

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
      { Icon: TrendingUp, text: 'See your followers, likes and support in one place' },
    ],
  },
}

/** The three most-liked real courses, fanned out. Renders nothing until they load. */
function CourseStack() {
  const courses = useAsync(() => listCourses({ sort: 'liked' }), [])
  const picks = (courses.data ?? []).slice(0, 3)
  if (picks.length === 0) return null

  // Put the most-liked course in front, with the others behind it.
  const [front, ...back] = picks
  const tilt = ['-rotate-[8deg] left-2', 'rotate-[8deg] right-2']

  return (
    <div className="relative mx-auto flex h-60 w-full max-w-md items-end justify-center" aria-hidden="true">
      {back.map((course, i) => (
        <div
          key={course.id}
          className={`absolute bottom-10 w-48 overflow-hidden rounded-2xl opacity-90 shadow-xl ring-1 ring-white/10 ${tilt[i]}`}
        >
          <CourseThumbnail course={course} compact />
        </div>
      ))}
      <div className="absolute bottom-0 z-10 w-60 overflow-hidden rounded-2xl bg-surface-container-lowest shadow-2xl">
        <CourseThumbnail course={front} compact />
        <div className="p-3">
          <p className="line-clamp-1 text-sm font-semibold text-on-surface">{front.title}</p>
          {front.tutor && (
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-on-surface-variant">
              <Avatar name={front.tutor.name} src={front.tutor.avatarUrl} size="xs" className="size-5 text-[9px]" />
              <span className="truncate">{front.tutor.name}</span>
              {front.likesCount > 0 && <span className="shrink-0">· {countLabel(front.likesCount, 'likes')}</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/** What tutors can expect from support, stated plainly with no example figures. */
function SupportExplainer() {
  const lines = [
    'Students choose a monthly amount from 500 XAF',
    'They pay with MTN Mobile Money or Orange Money',
    'They can cancel at any time',
    'Your courses stay free to watch either way',
  ]

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl bg-surface-container-lowest p-5 text-on-surface shadow-2xl" aria-hidden="true">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-tertiary-fixed text-tertiary-container">
          <Wallet className="size-5" />
        </span>
        <p className="font-semibold">How support works</p>
      </div>
      <ul className="mt-4 space-y-2.5 border-t border-outline-variant pt-4 text-sm">
        {lines.map((line) => (
          <li key={line} className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-tertiary-container" />
            {line}
          </li>
        ))}
      </ul>
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
            {variant === 'tutor' ? <SupportExplainer /> : <CourseStack />}
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
