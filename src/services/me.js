import { apiClient } from './apiClient'
import { USE_MOCKS, mockResponse } from './mock'
import { COURSES, TUTORS } from '@/data/mock'

/** PATCH /me — name, email, bio, and password change (needs currentPassword). */
export function updateMe(changes) {
  if (!USE_MOCKS) return apiClient.patch('/me', changes)
  if (changes.newPassword && !changes.currentPassword) {
    return Promise.reject(Object.assign(new Error('Enter your current password to set a new one.'), { status: 422 }))
  }
  const { currentPassword: _c, newPassword: _n, ...profile } = changes
  return mockResponse(profile)
}

// The two list endpoints below are not yet in the Backend SRS (see Frontend
// SRS §7 "Gap to raise with backend"); the paths are the proposed ones.

/** GET /me/following */
export function listFollowing() {
  if (!USE_MOCKS) return apiClient.get('/me/following')
  return mockResponse(TUTORS.slice(0, 3))
}

/** GET /me/likes */
export function listLikedCourses() {
  if (!USE_MOCKS) return apiClient.get('/me/likes')
  const liked = COURSES.filter((c) => ['c1', 'c2', 'c5', 'c11'].includes(c.id))
  return mockResponse(liked.map((c) => ({ ...c, tutor: TUTORS.find((t) => t.id === c.tutorId) })))
}
