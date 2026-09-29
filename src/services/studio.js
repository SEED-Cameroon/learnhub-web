import { apiClient, ApiError } from './apiClient'
import { toCourse } from './normalize'

// Earnings and payouts depend on Phase 2 backend endpoints (Frontend SRS
// §4.5). Turn this on once /tutors/me/earnings and /tutors/me/payouts exist.
export const EARNINGS_ENABLED = import.meta.env.VITE_ENABLE_EARNINGS === 'true'

// The fields the API stores for a course.
export const COURSE_FIELDS = ['title', 'description', 'category', 'priceXaf', 'thumbnailUrl', 'previewVideoUrl', 'status']

/** Page course → API body: only the fields the API stores, with `price` in whole XAF. */
function toApiCourse(course) {
  const body = {}
  for (const key of ['title', 'description', 'category', 'thumbnailUrl', 'previewVideoUrl', 'status']) {
    if (course[key] !== undefined) body[key] = typeof course[key] === 'string' ? course[key].trim() : course[key]
  }
  if (course.priceXaf !== undefined) body.price = Math.max(0, Math.round(Number(course.priceXaf) || 0))
  return body
}

/** GET /courses/mine — every course the tutor owns, drafts included. */
export async function listMyCourses() {
  const { courses } = await apiClient.get('/courses/mine')
  return courses.map((c) => toCourse(c))
}

/** One of the tutor's own courses for editing (drafts included). */
export async function getMyCourse(id) {
  const courses = await listMyCourses()
  const course = courses.find((c) => c.id === id)
  if (!course) throw new ApiError('Course not found', { status: 404 })
  return course
}

/** POST /courses — status is "draft" or "published". */
export async function createCourse(course) {
  const { course: created } = await apiClient.post('/courses', toApiCourse(course))
  return toCourse(created)
}

/** PATCH /courses/:id */
export async function updateCourse(id, changes) {
  const { course } = await apiClient.patch(`/courses/${id}`, toApiCourse(changes))
  return toCourse(course)
}

/** DELETE /courses/:id — the API also removes the course's likes and comments. */
export async function deleteCourse(id) {
  await apiClient.delete(`/courses/${id}`)
  return null
}

/**
 * Overview totals from GET /tutors/me/stats. Fields the API doesn't track
 * (views, rating, last month) are null and the dashboard leaves those tiles out.
 */
export async function getStudioOverview() {
  const { stats } = await apiClient.get('/tutors/me/stats')
  return {
    stats: {
      subscribers: stats.activeSupporters ?? 0,
      earningsXaf: stats.monthlySupportXaf ?? 0,
      earningsLastMonthXaf: null,
      views: null,
      rating: null,
      followers: stats.followers ?? 0,
      likes: stats.likes ?? 0,
      comments: stats.comments ?? 0,
      courses: stats.courses ?? 0,
      published: stats.published ?? 0,
    },
    activity: [],
  }
}

/** GET /tutors/me/earnings + /tutors/me/payouts (Phase 2 — not in the API yet). */
export async function getEarnings() {
  const [earnings, payouts] = await Promise.all([
    apiClient.get('/tutors/me/earnings'),
    apiClient.get('/tutors/me/payouts'),
  ])
  return { ...earnings, payouts }
}
