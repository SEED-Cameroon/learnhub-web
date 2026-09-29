import { apiClient } from './apiClient'
import { USE_MOCKS, mockResponse, MockNotFoundError } from './mock'
import { idempotent, toComment, toCourse, toTutor } from './normalize'
import { COURSES, COMMENTS, TUTORS } from '@/data/mock'

const withTutor = (course) => ({ ...course, tutor: TUTORS.find((t) => t.id === course.tutorId) })

const SORTERS = {
  popular: (a, b) => b.viewsCount - a.viewsCount,
  newest: (a, b) => b.publishedAt.localeCompare(a.publishedAt),
  liked: (a, b) => b.likesCount - a.likesCount,
}

// The API has no view counts, so "most watched" falls back to most liked.
const API_SORT = { popular: 'liked', liked: 'liked', newest: 'newest' }

/** GET /courses — published courses, optionally filtered. */
export async function listCourses({ category, q, sort = 'popular', tutorId } = {}) {
  if (!USE_MOCKS) {
    // The API filters by tutor only through the tutor's own page.
    if (tutorId) {
      const { tutor, courses } = await apiClient.get(`/tutors/${tutorId}`)
      const owner = toTutor(tutor)
      return courses.map((c) => toCourse(c, { tutor: owner }))
    }
    const params = new URLSearchParams({ limit: '100', sort: API_SORT[sort] ?? 'newest' })
    if (category) params.set('category', category)
    if (q?.trim()) params.set('q', q.trim())
    const { courses } = await apiClient.get(`/courses?${params}`)
    return courses.map((c) => toCourse(c))
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

/** GET /courses/:id — includes likedByMe when signed in. */
export async function getCourse(id) {
  if (!USE_MOCKS) {
    const { course, likedByMe } = await apiClient.get(`/courses/${id}`)
    return { ...toCourse(course), likedByMe: Boolean(likedByMe) }
  }
  const course = COURSES.find((c) => c.id === id)
  if (!course) return Promise.reject(new MockNotFoundError('Course not found'))
  return mockResponse(withTutor(course))
}

/** GET /courses/:id/comments — newest first. */
export async function listComments(courseId) {
  if (!USE_MOCKS) {
    const { comments } = await apiClient.get(`/courses/${courseId}/comments?limit=50`)
    return comments.map(toComment)
  }
  return mockResponse(COMMENTS[courseId] ?? [])
}

/** POST /courses/:id/comments */
export async function addComment(courseId, body, author) {
  if (!USE_MOCKS) {
    const { comment } = await apiClient.post(`/courses/${courseId}/comments`, { text: body })
    const mapped = toComment(comment)
    // Fall back to the signed-in user if the API returns the comment without its author populated.
    return mapped.author.name === 'LearnHub member' && author ? { ...mapped, author } : mapped
  }
  const comment = { id: `m${Date.now()}`, author, body, createdAt: new Date().toISOString(), likesCount: 0 }
  COMMENTS[courseId] = [comment, ...(COMMENTS[courseId] ?? [])]
  return mockResponse(comment)
}

/** POST / DELETE /likes/courses/:id/like — "already liked" and "not liked" count as done. */
export async function setCourseLiked(courseId, liked) {
  if (!USE_MOCKS) {
    const path = `/likes/courses/${courseId}/like`
    await (liked ? idempotent(() => apiClient.post(path), 409) : idempotent(() => apiClient.delete(path), 404))
    return { liked }
  }
  return mockResponse({ liked })
}
