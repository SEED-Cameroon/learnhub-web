import { useCallback, useEffect, useState } from 'react'

/**
 * Runs an async loader and tracks its loading / error / data states.
 * `deps` re-runs the loader; `reload()` retries after an error.
 */
export function useAsync(loader, deps = []) {
  const [state, setState] = useState({ data: undefined, error: null, loading: true })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    loader()
      .then((data) => !cancelled && setState({ data, error: null, loading: false }))
      .catch((error) => !cancelled && setState({ data: undefined, error, loading: false }))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const reload = useCallback(() => setAttempt((n) => n + 1), [])
  const setData = useCallback((update) => {
    setState((s) => ({ ...s, data: typeof update === 'function' ? update(s.data) : update }))
  }, [])

  return { ...state, reload, setData }
}
