// Comments API layer for course discussion (Issue #28).
//
// USE_MOCK_API=true simulates the real backend in-memory so the whole feature
// is testable right now. Once the real endpoints are live, flip this to false —
// every function below already calls the real fetch() endpoints in that branch,
// matching the shape the backend spec describes (paginated comments,
// authenticated like/unlike). No calling code needs to change either way.
const USE_MOCK_API = true;

const API_BASE_URL = "/api"; // TODO: point this at your real API origin once live

const DEFAULT_PAGE_SIZE = 5;

// ---------------------------------------------------------------------------
// Mock in-memory store — only used when USE_MOCK_API is true.
// Most course ids start with an empty array on purpose, so the empty state is
// easy to see while testing without needing to clear seeded data first.
// ---------------------------------------------------------------------------
const mockCommentsByCourse = {
  "gce-alevel-physics-mechanics": [
    {
      id: "seed-1",
      author: { name: "Achiri N.", avatarUrl: null },
      body: "This finally made simple harmonic motion click for me! Please can you do circular motion next?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      likeCount: 18,
      likedByCurrentUser: false,
    },
    {
      id: "seed-2",
      author: { name: "Divine T.", avatarUrl: null },
      body: "Please post the O-Level Additional Maths paper next, this format really helps.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      likeCount: 4,
      likedByCurrentUser: false,
    },
  ],
};

let mockNextId = 1000;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getMockList(courseId) {
  if (!mockCommentsByCourse[courseId]) mockCommentsByCourse[courseId] = [];
  return mockCommentsByCourse[courseId];
}

// ---------------------------------------------------------------------------
// GET paginated comments, newest first
// ---------------------------------------------------------------------------
export async function getComments({ courseId, page = 1, pageSize = DEFAULT_PAGE_SIZE }) {
  if (USE_MOCK_API) {
    await delay(500);
    const all = [...getMockList(courseId)].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const start = (page - 1) * pageSize;
    const pageItems = all.slice(start, start + pageSize);
    return {
      comments: pageItems,
      totalCount: all.length,
      hasMore: start + pageSize < all.length,
    };
  }

  const res = await fetch(
    `${API_BASE_URL}/courses/${courseId}/comments?page=${page}&pageSize=${pageSize}`
  );
  if (!res.ok) throw new Error("Couldn't load comments. Please try again.");
  return res.json(); // expected shape: { comments, totalCount, hasMore }
}

// ---------------------------------------------------------------------------
// POST a new comment — requires an auth token (guests are blocked below this
// layer too, in useAuth-gated UI, but this is the last line of defense)
// ---------------------------------------------------------------------------
export async function createComment({ courseId, body, token }) {
  if (!token) throw new Error("You must be logged in to comment.");

  if (USE_MOCK_API) {
    await delay(400);
    const comment = {
      id: `mock-${mockNextId++}`,
      author: { name: "You", avatarUrl: null },
      body,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      likedByCurrentUser: false,
    };
    getMockList(courseId).unshift(comment);
    return comment;
  }

  const res = await fetch(`${API_BASE_URL}/courses/${courseId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error("Couldn't post your comment. Please try again.");
  return res.json();
}

// ---------------------------------------------------------------------------
// Like / unlike — both require auth. Re-liking an already-liked comment is a
// no-op server-side (guards against duplicate likes from double clicks).
// ---------------------------------------------------------------------------
export async function likeComment({ commentId, courseId, token }) {
  if (!token) throw new Error("You must be logged in to like a comment.");

  if (USE_MOCK_API) {
    await delay(250);
    const list = getMockList(courseId);
    const c = list.find((x) => x.id === commentId);
    if (!c) throw new Error("Comment not found.");
    if (c.likedByCurrentUser) {
      return { commentId, likeCount: c.likeCount, likedByCurrentUser: true };
    }
    c.likedByCurrentUser = true;
    c.likeCount += 1;
    return { commentId, likeCount: c.likeCount, likedByCurrentUser: true };
  }

  const res = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Couldn't like this comment. Please try again.");
  return res.json(); // expected shape: { commentId, likeCount, likedByCurrentUser }
}

export async function unlikeComment({ commentId, courseId, token }) {
  if (!token) throw new Error("You must be logged in to unlike a comment.");

  if (USE_MOCK_API) {
    await delay(250);
    const list = getMockList(courseId);
    const c = list.find((x) => x.id === commentId);
    if (!c) throw new Error("Comment not found.");
    if (!c.likedByCurrentUser) {
      return { commentId, likeCount: c.likeCount, likedByCurrentUser: false };
    }
    c.likedByCurrentUser = false;
    c.likeCount = Math.max(0, c.likeCount - 1);
    return { commentId, likeCount: c.likeCount, likedByCurrentUser: false };
  }

  const res = await fetch(`${API_BASE_URL}/comments/${commentId}/unlike`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Couldn't unlike this comment. Please try again.");
  return res.json();
}