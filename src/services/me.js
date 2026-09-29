import { apiClient } from './apiClient'
import { USE_MOCKS, mockResponse } from './mock'
import { toCourse, toTutor, toUser } from './normalize'
import { COURSES, TUTORS } from '@/data/mock'

/** GET /me — the signed-in user's profile. */
export async function getMe() {
  if (!USE_MOCKS) {
    const { user } = await apiClient.get('/me')
    return toUser(user)
  }
  return mockResponse(null)
}

/** PATCH /me — name, email, bio, avatar, and password change (needs currentPassword). */
export async function updateMe(changes) {
  if (!USE_MOCKS) {
    const allowed = ['name', 'email', 'bio', 'avatarUrl', 'currentPassword', 'newPassword']
    const payload = Object.fromEntries(allowed.filter((k) => changes[k] !== undefined).map((k) => [k, changes[k]]))
    // Photos can't be uploaded yet; don't store a local blob: preview as the avatar.
    if (typeof payload.avatarUrl === 'string' && payload.avatarUrl.startsWith('blob:')) delete payload.avatarUrl
    if (payload.avatarUrl === null) delete payload.avatarUrl
    const { user } = await apiClient.patch('/me', payload)
    return toUser(user)
  }
  if (changes.newPassword && !changes.currentPassword) {
    return Promise.reject(Object.assign(new Error('Enter your current password to set a new one.'), { status: 422 }))
  }
  const { currentPassword: _c, newPassword: _n, ...profile } = changes
  return mockResponse(profile)
}

/** GET /me/following — tutors the signed-in user follows. */
export async function listFollowing() {
  if (!USE_MOCKS) {
    const { tutors } = await apiClient.get('/me/following')
    return tutors.map((t) => ({ ...toTutor(t), isFollowing: true }))
  }
  return mockResponse(TUTORS.slice(0, 3))
}

/** GET /me/likes — courses the signed-in user liked. */
export async function listLikedCourses() {
  if (!USE_MOCKS) {
    const { courses } = await apiClient.get('/me/likes')
    return courses.map((c) => ({ ...toCourse(c), likedByMe: true }))
  }
  const liked = COURSES.filter((c) => ['c1', 'c2', 'c5', 'c11'].includes(c.id))
  return mockResponse(liked.map((c) => ({ ...c, tutor: TUTORS.find((t) => t.id === c.tutorId) })))
}
