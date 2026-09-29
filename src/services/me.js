import { apiClient } from './apiClient'
import { toCourse, toTutor, toUser } from './normalize'

/** GET /me — the signed-in user's profile. */
export async function getMe() {
  const { user } = await apiClient.get('/me')
  return toUser(user)
}

/** PATCH /me — name, email, bio, avatar, and password change (needs currentPassword). */
export async function updateMe(changes) {
  const allowed = ['name', 'email', 'bio', 'avatarUrl', 'currentPassword', 'newPassword']
  const payload = Object.fromEntries(allowed.filter((k) => changes[k] !== undefined).map((k) => [k, changes[k]]))
  // Photos can't be uploaded yet; don't store a local blob: preview as the avatar.
  if (typeof payload.avatarUrl === 'string' && payload.avatarUrl.startsWith('blob:')) delete payload.avatarUrl
  if (payload.avatarUrl === null) delete payload.avatarUrl
  const { user } = await apiClient.patch('/me', payload)
  return toUser(user)
}

/** GET /me/following — tutors the signed-in user follows. */
export async function listFollowing() {
  const { tutors } = await apiClient.get('/me/following')
  return tutors.map((t) => ({ ...toTutor(t), isFollowing: true }))
}

/** GET /me/likes — courses the signed-in user liked. */
export async function listLikedCourses() {
  const { courses } = await apiClient.get('/me/likes')
  return courses.map((c) => ({ ...toCourse(c), likedByMe: true }))
}
