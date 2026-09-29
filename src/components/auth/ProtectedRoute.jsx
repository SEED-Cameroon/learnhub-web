import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

function RouteLoading() {
  return (
    <div role="status" className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
      Loading…
    </div>
  )
}

/** Where a signed-in user lands by default (Frontend SRS §4.2). */
export function homeFor(user) {
  return user?.role === 'tutor' ? '/dashboard' : '/courses'
}

// Requires any authenticated user (Student or Tutor)
export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <RouteLoading />
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return children
}

// Requires Tutor role; a Student is sent to their own account (Frontend SRS §3)
export function RequireTutor({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <RouteLoading />
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (user.role !== 'tutor') return <Navigate to="/account" replace />
  return children
}

// Only for guests (not logged in)
export function GuestOnly({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <RouteLoading />
  if (user) return <Navigate to={homeFor(user)} replace />
  return children
}
