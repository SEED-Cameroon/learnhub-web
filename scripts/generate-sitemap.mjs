// Writes dist/sitemap.xml after `vite build`: the public pages plus every
// published course and tutor from the API. If the API can't be reached
// (a sleeping free Render instance, for example) the static pages are still
// written, so a deploy never fails because of the sitemap.
import { writeFileSync } from 'node:fs'

const SITE = (process.env.VITE_SITE_URL || 'https://learnhub-omega-one.vercel.app').replace(/\/$/, '')
const API = (process.env.VITE_API_URL || '').replace(/\/$/, '')

const urls = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/courses', priority: '0.9', changefreq: 'daily' },
  { loc: '/tutors', priority: '0.8', changefreq: 'weekly' },
  { loc: '/about', priority: '0.5', changefreq: 'monthly' },
  { loc: '/register', priority: '0.4', changefreq: 'yearly' },
]

async function getJson(path) {
  const res = await fetch(API + path, { signal: AbortSignal.timeout(60_000) })
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return (await res.json()).data
}

if (API) {
  try {
    const [{ courses }, { tutors }] = await Promise.all([getJson('/courses?limit=100'), getJson('/tutors')])
    for (const c of courses) {
      urls.push({ loc: `/courses/${c._id}`, lastmod: (c.updatedAt || c.createdAt || '').slice(0, 10), priority: '0.8', changefreq: 'weekly' })
    }
    for (const t of tutors.filter((t) => t.coursesCount > 0)) {
      urls.push({ loc: `/tutors/${t._id}`, priority: '0.7', changefreq: 'weekly' })
    }
    console.log(`sitemap: ${courses.length} courses, ${tutors.filter((t) => t.coursesCount > 0).length} tutors`)
  } catch (err) {
    console.warn(`sitemap: API not reachable (${err.message}); writing the public pages only`)
  }
} else {
  console.warn('sitemap: VITE_API_URL is not set; writing the public pages only')
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${SITE}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
  )
  .join('\n')}
</urlset>
`
writeFileSync('dist/sitemap.xml', xml)
