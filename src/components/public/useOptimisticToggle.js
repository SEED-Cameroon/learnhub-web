import { useCallback, useRef, useState } from 'react'

/**
 * Optimistic on/off state with a counter (likes, follows). The UI flips
 * immediately; if `request(next)` rejects, both value and count roll back.
 */
export function useOptimisticToggle({ initialOn = false, initialCount = 0, request }) {
  const [on, setOn] = useState(initialOn)
  const [count, setCount] = useState(initialCount)
  const [error, setError] = useState('')
  const inFlight = useRef(false)

  const toggle = useCallback(
    async (next) => {
      if (inFlight.current) return
      const target = typeof next === 'boolean' ? next : !on
      if (target === on) return
      inFlight.current = true
      setError('')
      setOn(target)
      setCount((c) => c + (target ? 1 : -1))
      try {
        await request(target)
      } catch (err) {
        setOn(!target)
        setCount((c) => c + (target ? -1 : 1))
        setError(err?.message || 'That didn’t save. Try again.')
      } finally {
        inFlight.current = false
      }
    },
    [on, request],
  )

  return { on, count, error, toggle }
}
