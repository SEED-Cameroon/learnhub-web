import { apiClient } from './apiClient'
import { idempotent, toCourse, toTutor } from './normalize'

const matches = (needle) => (t) =>
  !needle ||
  t.name.toLowerCase().includes(needle) ||
  t.headline.toLowerCase().includes(needle) ||
  t.subjects?.some((s) => s.toLowerCase().includes(needle))

/** GET /tutors — filtered by subject tag on the server; the search text is matched here. */
export async function listTutors({ subject, q } = {}) {
  const needle = q?.trim().toLowerCase()
  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  const { tutors } = await apiClient.get(`/tutors?${params}`)
  // Tutors with published courses first, then by followers.
  return tutors
    .map(toTutor)
    .filter(matches(needle))
    .sort((a, b) => (b.coursesCount > 0) - (a.coursesCount > 0) || b.followersCount - a.followersCount)
}

/** GET /tutors/:id — the tutor, with their published courses on `courses`. */
export async function getTutor(id) {
  const { tutor, courses = [] } = await apiClient.get(`/tutors/${id}`)
  const mapped = toTutor(tutor)
  return {
    ...mapped,
    coursesCount: mapped.coursesCount ?? courses.length,
    courses: courses.map((c) => toCourse(c, { tutor: mapped })),
  }
}

/** POST / DELETE /users/:id/follow — "already following" and "not following" count as done. */
export async function setFollowing(tutorId, following) {
  const path = `/users/${tutorId}/follow`
  await (following ? idempotent(() => apiClient.post(path), 409) : idempotent(() => apiClient.delete(path), 404))
  return { following }
}

/** PATCH /tutors/:id — the signed-in tutor's public profile. */
export async function updateTutorProfile(id, changes) {
  const { name, avatarUrl, bannerUrl, bio, subjects, subjectTags, headline, city } = changes
  // A picked-but-not-uploaded image is a local blob: preview; never store that.
  const safe = (url) => (typeof url === 'string' && url.startsWith('blob:') ? undefined : (url ?? undefined))
  const payload = {
    name,
    avatarUrl: safe(avatarUrl),
    bannerUrl: safe(bannerUrl),
    bio,
    subjectTags: subjectTags ?? subjects,
    headline,
    city,
  }
  for (const key of Object.keys(payload)) if (payload[key] === undefined) delete payload[key]
  const { tutor } = await apiClient.patch(`/tutors/${id}`, payload)
  return toTutor(tutor)
}
