import { Link } from 'react-router-dom'
import { BookHeart } from 'lucide-react'

const COLUMNS = [
  {
    title: 'Learn',
    links: [
      { to: '/courses', label: 'Browse courses' },
      { to: '/tutors', label: 'Find a tutor' },
    ],
  },
  {
    title: 'Teach',
    links: [
      { to: '/register', label: 'Become a tutor' },
      { to: '/dashboard', label: 'Tutor studio' },
    ],
  },
  {
    title: 'LearnHub',
    links: [
      { to: '/about', label: 'About us' },
      { to: '/about#support', label: 'How supporting works' },
    ],
  },
]

const Footer = () => {
  return (
    <footer className="bg-surface-container-low w-full">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 px-4 py-12 md:grid-cols-[2fr_1fr_1fr_1fr] md:px-10">
        <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <BookHeart className="size-6 text-secondary-container" strokeWidth={2.25} aria-hidden="true" />
            LearnHub Cameroon
          </Link>
          <p className="max-w-xs text-sm text-on-surface-variant">
            Courses from Cameroonian tutors, free to watch. Support the ones who help you with Mobile Money.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-2">
            <h2 className="mb-1 text-sm font-semibold text-on-surface">{col.title}</h2>
            {col.links.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm text-on-surface-variant hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <div className="border-t border-outline-variant/60">
        <p className="mx-auto max-w-[1280px] px-4 py-5 text-xs text-on-surface-variant md:px-10">
          © {new Date().getFullYear()} LearnHub Cameroon
        </p>
      </div>
    </footer>
  )
}

export default Footer
