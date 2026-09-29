import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Start each new page at the top unless the URL targets an anchor. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
