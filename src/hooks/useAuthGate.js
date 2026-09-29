import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/**
 * Community-gated actions (Frontend SRS §4.3). `gate(action)` runs the
 * action when signed in; otherwise it sends the guest to /login and brings
 * them back to this page, with `pendingAction` so the page can finish it.
 */
export function useAuthGate() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const gate = useCallback(
    (action, pendingAction) => {
      if (isAuthenticated) return action()
      navigate('/login', { state: { from: location.pathname, pendingAction } })
    },
    [isAuthenticated, navigate, location.pathname]
  )

  return { gate, isAuthenticated, pendingAction: location.state?.pendingAction }
}
