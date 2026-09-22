import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function CourseDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");
  const [liking, setLiking] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [liked, setLiked] = useState(false);

  const loadCourse = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch(`/courses/${id}`);

      const data = response?.data?.course ?? response?.data ?? response;

      setCourse(data);
      setLiked(Boolean(data?.isLiked ?? data?.liked));
    } catch (err) {
      setError(err.message || "Unable to load this course.");
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    setCommentsLoading(true);

    try {
      const response = await apiFetch(`/courses/${id}/comments`);

      const data = response?.data?.comments ?? response?.data ?? response;

      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
    loadComments();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated || liking) {
      return;
    }

    setLiking(true);
    setError("");

    try {
      if (liked) {
        await apiFetch(`/courses/${id}/like`, {
          method: "DELETE",
        });
      } else {
        await apiFetch(`/courses/${id}/like`, {
          method: "POST",
        });
      }

      setLiked((currentLiked) => !currentLiked);
      await loadCourse();
    } catch (err) {
      setError(err.message || "Unable to update your like.");
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      return;
    }

    const trimmedComment = commentText.trim();

    if (!trimmedComment) {
      setCommentError("Please enter a comment.");
      return;
    }

    setCommentError("");
    setCommenting(true);

    try {
      await apiFetch(`/courses/${id}/comments`, {
        method: "POST",
        body: JSON.stringify({
          content: trimmedComment,
        }),
      });

      setCommentText("");
      await loadComments();
    } catch (err) {
      setCommentError(err.message || "Unable to post your comment.");
    } finally {
      setCommenting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-5xl animate-pulse rounded-xl bg-white p-8 shadow-sm">
          <div className="h-8 w-2/3 rounded bg-slate-200" />
          <div className="mt-4 h-4 w-full rounded bg-slate-200" />
          <div className="mt-2 h-4 w-4/5 rounded bg-slate-200" />
          <div className="mt-8 h-64 rounded-lg bg-slate-200" />
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-5xl rounded-xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-bold text-red-800">
            Course not found
          </h1>

          <p className="mt-2 text-red-700">
            {error || "This course could not be found."}
          </p>

          <Link
            to="/courses"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Back to courses
          </Link>
        </div>
      </main>
    );
  }

  const tutor = course.tutor || course.author;

  const likeCount =
    course.likesCount ?? course.likeCount ?? course.likes ?? 0;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/courses"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Back to courses
        </Link>

        <article className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
          {course.thumbnailUrl && (
            <img
              src={course.thumbnailUrl}
              alt={course.title || "Course"}
              className="h-64 w-full object-cover"
            />
          )}

          {course.thumbnail && !course.thumbnailUrl && (
            <img
              src={course.thumbnail}
              alt={course.title || "Course"}
              className="h-64 w-full object-cover"
            />
          )}

          <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-900">
              {course.title || "Untitled course"}
            </h1>

            {course.category && (
              <p className="mt-3 text-sm font-medium text-blue-600">
                {course.category}
              </p>
            )}

            <p className="mt-5 leading-7 text-slate-600">
              {course.description || "No course description available."}
            </p>

            <div className="mt-6">
              <p className="text-sm font-medium text-slate-500">
                Course price
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {course.price ?? 0} FCFA
              </p>
            </div>

            {tutor && (
              <Link
                to={`/tutors/${tutor.id || tutor._id}`}
                className="mt-6 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Taught by {tutor.name || "Tutor"}
              </Link>
            )}

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={handleLike}
                disabled={!isAuthenticated || liking}
                className={`rounded-lg border px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  liked
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600"
                }`}
              >
                {liking
                  ? "Updating..."
                  : liked
                    ? "Unlike"
                    : "Like"}
              </button>

              <span className="text-sm text-slate-600">
                {likeCount} {likeCount === 1 ? "like" : "likes"}
              </span>

              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Log in to like and comment
                </Link>
              )}
            </div>
          </div>
        </article>

        <section className="mt-8 rounded-xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Comments
          </h2>

          {isAuthenticated && (
            <form onSubmit={handleComment} className="mt-6">
              <label
                htmlFor="comment"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Add a comment
              </label>

              <textarea
                id="comment"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                rows="4"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                placeholder="Share your thoughts about this course"
              />

              {commentError && (
                <p className="mt-2 text-sm text-red-600">
                  {commentError}
                </p>
              )}

              <button
                type="submit"
                disabled={commenting}
                className="mt-4 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {commenting ? "Posting..." : "Post comment"}
              </button>
            </form>
          )}

          {commentsLoading ? (
            <div className="mt-8 space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-lg bg-slate-50 p-5"
                >
                  <div className="h-4 w-1/4 rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-full rounded bg-slate-200" />
                  <div className="mt-2 h-4 w-3/4 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-6">
              <p className="text-slate-600">
                No comments yet.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {comments.map((comment) => (
                <article
                  key={comment.id || comment._id}
                  className="rounded-lg border border-slate-200 p-5"
                >
                  <h3 className="font-semibold text-slate-900">
                    {comment.user?.name ||
                      comment.author?.name ||
                      comment.userName ||
                      "Learner"}
                  </h3>

                  <p className="mt-2 leading-6 text-slate-600">
                    {comment.content || comment.text || ""}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default CourseDetails;