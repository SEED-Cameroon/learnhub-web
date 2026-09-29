import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/**
 * After a guest logs in from a gated action, Login returns them here with
 * `state.pendingAction`. Run the matching handler once, then clear the state
 * so a refresh or back-navigation doesn't repeat it.
 */
export function usePendingAction(handlers, ready = true) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const done = useRef(false)
  const pending = location.state?.pendingAction

  useEffect(() => {
    if (done.current || !ready || !isAuthenticated || !pending) return
    done.current = true
    handlers[pending.type]?.(pending)
    navigate(location.pathname + location.search, { replace: true, state: null })
  }, [ready, isAuthenticated, pending, handlers, navigate, location.pathname, location.search])
}
