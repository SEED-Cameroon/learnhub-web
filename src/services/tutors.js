import { apiClient } from './apiClient'
import { USE_MOCKS, mockResponse, MockNotFoundError } from './mock'
import { TUTORS } from '@/data/mock'

/** GET /tutors — optionally filtered by subject tag or search text. */
export function listTutors({ subject, q } = {}) {
  if (!USE_MOCKS) {
    const params = new URLSearchParams()
    if (subject) params.set('subject', subject)
    if (q) params.set('q', q)
    return apiClient.get(`/tutors?${params}`)
  }
  const needle = q?.trim().toLowerCase()
  const items = TUTORS.filter((t) => !subject || t.subjects.includes(subject)).filter(
    (t) => !needle || t.name.toLowerCase().includes(needle) || t.headline.toLowerCase().includes(needle)
  )
  return mockResponse(items)
}

/** GET /tutors/:id */
export function getTutor(id) {
  if (!USE_MOCKS) return apiClient.get(`/tutors/${id}`)
  const tutor = TUTORS.find((t) => t.id === id)
  if (!tutor) return Promise.reject(new MockNotFoundError('Tutor not found'))
  return mockResponse(tutor)
}

/** POST / DELETE /tutors/:id/follow */
export function setFollowing(tutorId, following) {
  if (!USE_MOCKS) {
    return following ? apiClient.post(`/tutors/${tutorId}/follow`) : apiClient.delete(`/tutors/${tutorId}/follow`)
  }
  return mockResponse({ following })
}

/** PATCH /tutors/:id — the signed-in tutor's public profile. */
export function updateTutorProfile(id, changes) {
  if (!USE_MOCKS) return apiClient.patch(`/tutors/${id}`, changes)
  return mockResponse({ ...TUTORS.find((t) => t.id === id), ...changes })
}
