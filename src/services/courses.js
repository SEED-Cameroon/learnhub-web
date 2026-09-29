import { apiClient } from './apiClient'
import { USE_MOCKS, mockResponse, MockNotFoundError } from './mock'
import { COURSES, COMMENTS, TUTORS } from '@/data/mock'

const withTutor = (course) => ({ ...course, tutor: TUTORS.find((t) => t.id === course.tutorId) })

const SORTERS = {
  popular: (a, b) => b.viewsCount - a.viewsCount,
  newest: (a, b) => b.publishedAt.localeCompare(a.publishedAt),
  liked: (a, b) => b.likesCount - a.likesCount,
}

/** GET /courses — published courses, optionally filtered. */
export function listCourses({ category, q, sort = 'popular', tutorId } = {}) {
  if (!USE_MOCKS) {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (q) params.set('q', q)
    if (sort) params.set('sort', sort)
    if (tutorId) params.set('tutorId', tutorId)
    return apiClient.get(`/courses?${params}`)
  }
  const needle = q?.trim().toLowerCase()
  const items = COURSES.filter((c) => c.status === 'published')
    .filter((c) => !category || c.category === category)
    .filter((c) => !tutorId || c.tutorId === tutorId)
    .filter((c) => !needle || c.title.toLowerCase().includes(needle) || c.category.toLowerCase().includes(needle))
    .sort(SORTERS[sort] ?? SORTERS.popular)
    .map(withTutor)
  return mockResponse(items)
}

/** GET /courses/:id */
export function getCourse(id) {
  if (!USE_MOCKS) return apiClient.get(`/courses/${id}`)
  const course = COURSES.find((c) => c.id === id)
  if (!course) return Promise.reject(new MockNotFoundError('Course not found'))
  return mockResponse(withTutor(course))
}

/** GET /courses/:id/comments */
export function listComments(courseId) {
  if (!USE_MOCKS) return apiClient.get(`/courses/${courseId}/comments`)
  return mockResponse(COMMENTS[courseId] ?? [])
}

/** POST /courses/:id/comments */
export function addComment(courseId, body, author) {
  if (!USE_MOCKS) return apiClient.post(`/courses/${courseId}/comments`, { body })
  const comment = { id: `m${Date.now()}`, author, body, createdAt: new Date().toISOString(), likesCount: 0 }
  COMMENTS[courseId] = [comment, ...(COMMENTS[courseId] ?? [])]
  return mockResponse(comment)
}

/** POST / DELETE /courses/:id/likes */
export function setCourseLiked(courseId, liked) {
  if (!USE_MOCKS) {
    return liked ? apiClient.post(`/courses/${courseId}/likes`) : apiClient.delete(`/courses/${courseId}/likes`)
  }
  return mockResponse({ liked })
}
