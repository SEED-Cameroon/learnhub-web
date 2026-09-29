import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { DEFAULT_DESCRIPTION, DEFAULT_IMAGE, SITE_NAME, SITE_URL } from '@/lib/site'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

const trim = (text, max = 160) => {
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim()
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean
}

/**
 * Sets the page title, description, canonical link, Open Graph / Twitter
 * tags and optional JSON-LD for the current route. Pass noindex for private
 * pages (account, studio, auth). Values fall back to the site defaults.
 */
export function useSeo({ title, description, image, type = 'website', noindex = false, jsonLd } = {}) {
  const { pathname } = useLocation()
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} · Free courses from Cameroonian tutors`
  const desc = trim(description || DEFAULT_DESCRIPTION)
  const img = image || DEFAULT_IMAGE
  const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`
  const ld = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    document.title = fullTitle
    setMeta('name', 'description', desc)
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    setCanonical(url)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:image', img)
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', desc)
    setMeta('name', 'twitter:image', img)

    let script
    if (ld) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.page = 'true'
      script.textContent = ld
      document.head.appendChild(script)
    }
    return () => script?.remove()
  }, [fullTitle, desc, url, type, img, noindex, ld])
}
