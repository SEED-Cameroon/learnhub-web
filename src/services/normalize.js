// Map learnhub-api documents onto the shapes the pages use, so pages read the
// same fields in sample mode and against the real API.

const idOf = (value) => (value && typeof value === 'object' ? String(value._id ?? value.id ?? '') : value ? String(value) : '')

/** API user/tutor → page tutor. Counts stay undefined when the API doesn't send them. */
export function toTutor(t) {
  if (!t || typeof t !== 'object') return t ? { id: String(t) } : null
  const subjects = t.subjectTags ?? t.subjects ?? []
  return {
    id: idOf(t),
    name: t.name ?? '',
    email: t.email,
    avatarUrl: t.avatarUrl || null,
    bannerUrl: t.bannerUrl || null,
    bio: t.bio ?? '',
    subjects,
    headline: t.headline || subjects[0] || 'Tutor',
    city: t.city || '',
    followersCount: t.followersCount ?? 0,
    coursesCount: t.coursesCount,
    isFollowing: Boolean(t.isFollowing),
    verified: Boolean(t.verified),
  }
}

/** API course → page course. */
export function toCourse(c, { tutor } = {}) {
  if (!c) return c
  const populated = c.tutor && typeof c.tutor === 'object' ? toTutor(c.tutor) : null
  return {
    id: idOf(c),
    title: c.title ?? '',
    description: c.description ?? '',
    category: c.category ?? '',
    priceXaf: c.price ?? 0,
    thumbnailUrl: c.thumbnailUrl || '',
    previewVideoUrl: c.previewVideoUrl || '',
    status: c.status ?? 'published',
    likesCount: c.likesCount ?? 0,
    commentsCount: c.commentsCount ?? 0,
    publishedAt: c.createdAt,
    updatedAt: c.updatedAt,
    tutorId: populated?.id || idOf(c.tutor) || tutor?.id || '',
    tutor: populated ?? tutor ?? null,
    likedByMe: Boolean(c.likedByMe),
    viewsCount: c.viewsCount,
    level: c.level || '',
    outcomes: c.outcomes ?? [],
    lessons: (c.lessons ?? []).map((l, i) => ({
      id: idOf(l) || `lesson-${i}`,
      title: l.title ?? '',
      summary: l.summary ?? '',
      durationMin: l.durationMin ?? 0,
      videoUrl: l.videoUrl || '',
      videoCredit: l.videoCredit || '',
    })),
  }
}

export function toComment(m) {
  const user = m.user && typeof m.user === 'object' ? m.user : {}
  return {
    id: idOf(m),
    body: m.text ?? '',
    createdAt: m.createdAt,
    author: { id: idOf(user) || idOf(m.user), name: user.name ?? 'LearnHub member', avatarUrl: user.avatarUrl || null },
  }
}

export function toSubscription(s) {
  const tutor = s.tutor && typeof s.tutor === 'object' ? toTutor(s.tutor) : null
  return {
    id: idOf(s),
    tutorId: tutor?.id || idOf(s.tutor),
    tutor,
    amountXaf: s.amount,
    provider: s.provider,
    phoneNumber: s.phoneNumber,
    status: s.status,
    startedAt: s.startedAt ?? s.createdAt,
    nextBillingAt: s.nextBillingDate ?? null,
    cancelledAt: s.cancelledAt ?? null,
  }
}

export function toUser(u) {
  if (!u) return u
  return {
    id: idOf(u),
    name: u.name ?? '',
    email: u.email ?? '',
    role: u.role ?? 'student',
    avatarUrl: u.avatarUrl || null,
    bio: u.bio ?? '',
    subjects: u.subjectTags ?? [],
    headline: u.headline ?? '',
    city: u.city ?? '',
    createdAt: u.createdAt,
  }
}

/** For writes where a 409 (already done) or 404 (already undone) means the state is what we wanted. */
export async function idempotent(request, okStatus) {
  try {
    return await request()
  } catch (err) {
    if (err?.status === okStatus) return null
    throw err
  }
}
