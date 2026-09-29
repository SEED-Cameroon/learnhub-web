import { apiClient } from './apiClient'
import { idempotent, toComment, toCourse, toTutor } from './normalize'

// The API has no view counts, so "most watched" falls back to most liked.
const API_SORT = { popular: 'liked', liked: 'liked', newest: 'newest' }

/** GET /courses — published courses, optionally filtered. */
export async function listCourses({ category, q, sort = 'popular', tutorId } = {}) {
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

/** GET /courses/:id — includes likedByMe when signed in. */
export async function getCourse(id) {
  const { course, likedByMe } = await apiClient.get(`/courses/${id}`)
  return { ...toCourse(course), likedByMe: Boolean(likedByMe) }
}

/** GET /courses/:id/comments — newest first. */
export async function listComments(courseId) {
  const { comments } = await apiClient.get(`/courses/${courseId}/comments?limit=50`)
  return comments.map(toComment)
}

/** POST /courses/:id/comments */
export async function addComment(courseId, body, author) {
  const { comment } = await apiClient.post(`/courses/${courseId}/comments`, { text: body })
  const mapped = toComment(comment)
  // Fall back to the signed-in user if the API returns the comment without its author populated.
  return mapped.author.name === 'LearnHub member' && author ? { ...mapped, author } : mapped
}

/** POST / DELETE /likes/courses/:id/like — "already liked" and "not liked" count as done. */
export async function setCourseLiked(courseId, liked) {
  const path = `/likes/courses/${courseId}/like`
  await (liked ? idempotent(() => apiClient.post(path), 409) : idempotent(() => apiClient.delete(path), 404))
  return { liked }
}
