import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Requires any authenticated user (Student or Tutor)
export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

// Requires Tutor role only
export function RequireTutor({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user.role !== 'tutor') {
    // Student trying to access tutor routes → send to courses
    return <Navigate to="/courses" replace />
  }

  return children
}

// Only for guests (not logged in)
export function GuestOnly({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (user) {
    // Already logged in → redirect based on role
    return (
      <Navigate
        to={user.role === 'tutor' ? '/dashboard' : '/courses'}
        replace
      />
    )
  }

  return children
}