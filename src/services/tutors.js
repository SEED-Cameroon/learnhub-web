import { apiClient } from './apiClient'
import { USE_MOCKS, mockResponse, MockNotFoundError } from './mock'
import { idempotent, toCourse, toTutor } from './normalize'
import { COURSES, TUTORS } from '@/data/mock'

// Adds the published-course count and the two most-viewed course previews
// ({ id, title, category, viewsCount }) for the tutor card. Sample mode only:
// the API returns counts but no course previews, and TutorCard falls back to subject chips.
const withCourseCount = (t) => {
  const published = COURSES.filter((c) => c.tutorId === t.id && c.status === 'published')
  return {
    ...t,
    coursesCount: published.length,
    recentCourses: [...published]
      .sort((a, b) => b.viewsCount - a.viewsCount)
      .slice(0, 2)
      .map(({ id, title, category, viewsCount }) => ({ id, title, category, viewsCount })),
  }
}

const matches = (needle) => (t) =>
  !needle ||
  t.name.toLowerCase().includes(needle) ||
  t.headline.toLowerCase().includes(needle) ||
  t.subjects?.some((s) => s.toLowerCase().includes(needle))

/** GET /tutors — filtered by subject tag on the server; the search text is matched here. */
export async function listTutors({ subject, q } = {}) {
  const needle = q?.trim().toLowerCase()
  if (!USE_MOCKS) {
    const params = new URLSearchParams()
    if (subject) params.set('subject', subject)
    const { tutors } = await apiClient.get(`/tutors?${params}`)
    return tutors.map(toTutor).filter(matches(needle))
  }
  const items = TUTORS.filter((t) => !subject || t.subjects.includes(subject)).filter(matches(needle))
  return mockResponse(items.map(withCourseCount))
}

/** GET /tutors/:id — the tutor, with their published courses on `courses`. */
export async function getTutor(id) {
  if (!USE_MOCKS) {
    const { tutor, courses = [] } = await apiClient.get(`/tutors/${id}`)
    const mapped = toTutor(tutor)
    return { ...mapped, coursesCount: mapped.coursesCount ?? courses.length, courses: courses.map((c) => toCourse(c, { tutor: mapped })) }
  }
  const tutor = TUTORS.find((t) => t.id === id)
  if (!tutor) return Promise.reject(new MockNotFoundError('Tutor not found'))
  return mockResponse(withCourseCount(tutor))
}

/** POST / DELETE /users/:id/follow — "already following" and "not following" count as done. */
export async function setFollowing(tutorId, following) {
  if (!USE_MOCKS) {
    const path = `/users/${tutorId}/follow`
    await (following ? idempotent(() => apiClient.post(path), 409) : idempotent(() => apiClient.delete(path), 404))
    return { following }
  }
  return mockResponse({ following })
}

/** PATCH /tutors/:id — the signed-in tutor's public profile. */
export async function updateTutorProfile(id, changes) {
  if (!USE_MOCKS) {
    const { name, avatarUrl, bio, subjects, subjectTags, headline, city } = changes
    // A picked-but-not-uploaded photo is a local blob: preview; never store that as the avatar.
    const safeAvatar = typeof avatarUrl === 'string' && avatarUrl.startsWith('blob:') ? undefined : avatarUrl
    const payload = { name, avatarUrl: safeAvatar ?? undefined, bio, subjectTags: subjectTags ?? subjects, headline, city }
    for (const key of Object.keys(payload)) if (payload[key] === undefined) delete payload[key]
    const { tutor } = await apiClient.patch(`/tutors/${id}`, payload)
    return toTutor(tutor)
  }
  return mockResponse({ ...TUTORS.find((t) => t.id === id), ...changes })
}
