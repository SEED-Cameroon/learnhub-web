import { apiClient } from './apiClient'
import { USE_MOCKS, mockResponse, MockNotFoundError } from './mock'
import { toCourse } from './normalize'
import { COURSES, STUDIO } from '@/data/mock'

// In mock mode the signed-in tutor owns Dr. Foning's courses.
const MOCK_TUTOR_ID = 't1'

// Earnings and payouts depend on Phase 2 backend endpoints (Frontend SRS
// §4.5). Keep this off against the real API until those endpoints are live.
export const EARNINGS_ENABLED = USE_MOCKS || import.meta.env.VITE_ENABLE_EARNINGS === 'true'

// The course editor stores lessons and level only in sample mode; the API
// keeps these fields instead.
export const COURSE_FIELDS = USE_MOCKS
  ? ['title', 'description', 'category', 'level', 'priceXaf', 'lessons', 'status']
  : ['title', 'description', 'category', 'priceXaf', 'thumbnailUrl', 'previewVideoUrl', 'status']

const courseEarnings = (c) => Math.round(c.viewsCount * 1.9)

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
  if (!USE_MOCKS) {
    const { courses } = await apiClient.get('/courses/mine')
    return courses.map((c) => toCourse(c))
  }
  return mockResponse(
    COURSES.filter((c) => c.tutorId === MOCK_TUTOR_ID).map((c) => ({ ...c, earningsXaf: courseEarnings(c) }))
  )
}

/** One of the tutor's own courses for editing (drafts included). */
export async function getMyCourse(id) {
  if (!USE_MOCKS) {
    const courses = await listMyCourses()
    const course = courses.find((c) => c.id === id)
    if (!course) throw new MockNotFoundError('Course not found')
    return course
  }
  const course = COURSES.find((c) => c.id === id && c.tutorId === MOCK_TUTOR_ID)
  if (!course) return Promise.reject(new MockNotFoundError('Course not found'))
  return mockResponse(course)
}

/** POST /courses — status is "draft" or "published". */
export async function createCourse(course) {
  if (!USE_MOCKS) {
    const { course: created } = await apiClient.post('/courses', toApiCourse(course))
    return toCourse(created)
  }
  const created = {
    likesCount: 0,
    commentsCount: 0,
    viewsCount: 0,
    lessons: [],
    ...course,
    id: `c${Date.now()}`,
    tutorId: MOCK_TUTOR_ID,
    publishedAt: new Date().toISOString().slice(0, 10),
  }
  COURSES.push(created)
  return mockResponse(created)
}

/** PATCH /courses/:id */
export async function updateCourse(id, changes) {
  if (!USE_MOCKS) {
    const { course } = await apiClient.patch(`/courses/${id}`, toApiCourse(changes))
    return toCourse(course)
  }
  const course = COURSES.find((c) => c.id === id)
  Object.assign(course, changes)
  return mockResponse(course)
}

/** DELETE /courses/:id — the API also removes the course's likes and comments. */
export async function deleteCourse(id) {
  if (!USE_MOCKS) {
    await apiClient.delete(`/courses/${id}`)
    return null
  }
  const index = COURSES.findIndex((c) => c.id === id)
  if (index !== -1) COURSES.splice(index, 1)
  return mockResponse(null)
}

/**
 * Overview totals. Against the API this is GET /tutors/me/stats: fields the
 * API doesn't track (views, rating, last month) come back null and the
 * dashboard leaves those tiles out.
 */
export async function getStudioOverview() {
  if (!USE_MOCKS) {
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
  return mockResponse({ stats: STUDIO.stats, activity: STUDIO.activity })
}

/** GET /tutors/me/earnings + /tutors/me/payouts (Phase 2) */
export async function getEarnings() {
  if (!USE_MOCKS) {
    const [earnings, payouts] = await Promise.all([
      apiClient.get('/tutors/me/earnings'),
      apiClient.get('/tutors/me/payouts'),
    ])
    return { ...earnings, payouts }
  }
  return mockResponse({ stats: STUDIO.stats, supporters: STUDIO.supporters, payouts: STUDIO.payouts })
}
