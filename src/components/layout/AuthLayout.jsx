import { Link, Outlet } from 'react-router-dom'
import { BookHeart } from 'lucide-react'

// Minimal centred shell for Login / Signup (Frontend SRS §3).
export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-container-low">
      <header className="px-4 py-5 md:px-10">
        <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold text-primary">
          <BookHeart className="size-7 text-secondary-container" strokeWidth={2.25} aria-hidden="true" />
          LearnHub Cameroon
        </Link>
      </header>
      <main id="main" className="flex flex-1 items-start justify-center px-4 pb-16 pt-4 md:items-center md:pt-0">
        <Outlet />
      </main>
    </div>
  )
}
