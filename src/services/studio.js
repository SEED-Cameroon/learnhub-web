import { apiClient } from './apiClient'
import { USE_MOCKS, mockResponse, MockNotFoundError } from './mock'
import { COURSES, STUDIO } from '@/data/mock'

// In mock mode the signed-in tutor owns Dr. Foning's courses.
const MOCK_TUTOR_ID = 't1'

// Earnings and payouts depend on Phase 2 backend endpoints (Frontend SRS
// §4.5). Keep this off against the real API until those endpoints are live.
export const EARNINGS_ENABLED = USE_MOCKS || import.meta.env.VITE_ENABLE_EARNINGS === 'true'

const courseEarnings = (c) => Math.round(c.viewsCount * 1.9)

/** GET /courses?mine=true — every course the tutor owns, drafts included. */
export function listMyCourses() {
  if (!USE_MOCKS) return apiClient.get('/courses?mine=true')
  return mockResponse(
    COURSES.filter((c) => c.tutorId === MOCK_TUTOR_ID).map((c) => ({ ...c, earningsXaf: courseEarnings(c) }))
  )
}

/** GET /courses/:id for editing. */
export function getMyCourse(id) {
  if (!USE_MOCKS) return apiClient.get(`/courses/${id}`)
  const course = COURSES.find((c) => c.id === id && c.tutorId === MOCK_TUTOR_ID)
  if (!course) return Promise.reject(new MockNotFoundError('Course not found'))
  return mockResponse(course)
}

/** POST /courses — status is "draft" or "published". */
export function createCourse(course) {
  if (!USE_MOCKS) return apiClient.post('/courses', course)
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
export function updateCourse(id, changes) {
  if (!USE_MOCKS) return apiClient.patch(`/courses/${id}`, changes)
  const course = COURSES.find((c) => c.id === id)
  Object.assign(course, changes)
  return mockResponse(course)
}

/** DELETE /courses/:id */
export function deleteCourse(id) {
  if (!USE_MOCKS) return apiClient.delete(`/courses/${id}`)
  const index = COURSES.findIndex((c) => c.id === id)
  if (index !== -1) COURSES.splice(index, 1)
  return mockResponse(null)
}

/** GET /tutors/me/earnings (Phase 2) — overview totals and recent activity. */
export function getStudioOverview() {
  if (!USE_MOCKS) return apiClient.get('/tutors/me/earnings')
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
