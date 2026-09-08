// Course-like and tutor-follow API layer (Issue #32).
//
// Same pattern as commentsApi.js: USE_MOCK_API=true simulates the backend
// in-memory so the feature is fully testable now. Flip it to false once the
// real endpoints exist — the fetch() branches already match the shape the
// backend would return.
const USE_MOCK_API = true;

const API_BASE_URL = "/api"; // TODO: point this at your real API origin once live

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Mock in-memory stores — seeded lazily from whatever initial count the page
// already has, so state persists for the session but resets on refresh.
// ---------------------------------------------------------------------------
const mockCourseLikes = {}; // courseId -> { likeCount, likedByCurrentUser }
const mockTutorFollows = {}; // tutorId -> { followerCount, followedByCurrentUser }

function seedCourseLikes(courseId, initialCount) {
  if (!mockCourseLikes[courseId]) {
    mockCourseLikes[courseId] = { likeCount: initialCount, likedByCurrentUser: false };
  }
  return mockCourseLikes[courseId];
}

function seedTutorFollow(tutorId, initialCount) {
  if (!mockTutorFollows[tutorId]) {
    mockTutorFollows[tutorId] = { followerCount: initialCount, followedByCurrentUser: false };
  }
  return mockTutorFollows[tutorId];
}

// ---------------------------------------------------------------------------
// Course likes
// ---------------------------------------------------------------------------
export async function getCourseLikeStatus({ courseId, initialLikeCount = 0 }) {
  if (USE_MOCK_API) {
    await delay(300);
    return { ...seedCourseLikes(courseId, initialLikeCount) };
  }
  const res = await fetch(`${API_BASE_URL}/courses/${courseId}/like-status`);
  if (!res.ok) throw new Error("Couldn't load like status.");
  return res.json(); // expected shape: { likeCount, likedByCurrentUser }
}

export async function likeCourse({ courseId, initialLikeCount = 0, token }) {
  if (!token) throw new Error("You must be logged in to like a course.");
  if (USE_MOCK_API) {
    await delay(250);
    const state = seedCourseLikes(courseId, initialLikeCount);
    if (state.likedByCurrentUser) return { ...state }; // guards duplicate likes
    state.likedByCurrentUser = true;
    state.likeCount += 1;
    return { ...state };
  }
  const res = await fetch(`${API_BASE_URL}/courses/${courseId}/like`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Couldn't like this course. Please try again.");
  return res.json();
}

export async function unlikeCourse({ courseId, initialLikeCount = 0, token }) {
  if (!token) throw new Error("You must be logged in to unlike a course.");
  if (USE_MOCK_API) {
    await delay(250);
    const state = seedCourseLikes(courseId, initialLikeCount);
    if (!state.likedByCurrentUser) return { ...state };
    state.likedByCurrentUser = false;
    state.likeCount = Math.max(0, state.likeCount - 1);
    return { ...state };
  }
  const res = await fetch(`${API_BASE_URL}/courses/${courseId}/unlike`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Couldn't unlike this course. Please try again.");
  return res.json();
}

// ---------------------------------------------------------------------------
// Tutor follows
// ---------------------------------------------------------------------------
export async function getTutorFollowStatus({ tutorId, initialFollowerCount = 0 }) {
  if (USE_MOCK_API) {
    await delay(300);
    return { ...seedTutorFollow(tutorId, initialFollowerCount) };
  }
  const res = await fetch(`${API_BASE_URL}/tutors/${tutorId}/follow-status`);
  if (!res.ok) throw new Error("Couldn't load follow status.");
  return res.json(); // expected shape: { followerCount, followedByCurrentUser }
}

export async function followTutor({ tutorId, initialFollowerCount = 0, token }) {
  if (!token) throw new Error("You must be logged in to follow a tutor.");
  if (USE_MOCK_API) {
    await delay(250);
    const state = seedTutorFollow(tutorId, initialFollowerCount);
    if (state.followedByCurrentUser) return { ...state }; // guards duplicate follows
    state.followedByCurrentUser = true;
    state.followerCount += 1;
    return { ...state };
  }
  const res = await fetch(`${API_BASE_URL}/tutors/${tutorId}/follow`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Couldn't follow this tutor. Please try again.");
  return res.json();
}

export async function unfollowTutor({ tutorId, initialFollowerCount = 0, token }) {
  if (!token) throw new Error("You must be logged in to unfollow a tutor.");
  if (USE_MOCK_API) {
    await delay(250);
    const state = seedTutorFollow(tutorId, initialFollowerCount);
    if (!state.followedByCurrentUser) return { ...state };
    state.followedByCurrentUser = false;
    state.followerCount = Math.max(0, state.followerCount - 1);
    return { ...state };
  }
  const res = await fetch(`${API_BASE_URL}/tutors/${tutorId}/unfollow`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Couldn't unfollow this tutor. Please try again.");
  return res.json();
}