import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Loader2, MessageSquare } from "lucide-react";
import CommentRow from "./CommentRow";
import { useAuth } from "../../hooks/useAuth";
import { getComments, createComment, likeComment, unlikeComment } from "../../services/commentsApi";

export default function CourseComments({ courseId, onCountChange }) {
  const { isAuthenticated, token } = useAuth();

  const [comments, setComments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [newCommentBody, setNewCommentBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [likePendingIds, setLikePendingIds] = useState(() => new Set());
  const [likeError, setLikeError] = useState(null);

  const loadPage = useCallback(
    async (pageNum, append) => {
      if (append) setLoadingMore(true);
      else setInitialLoading(true);
      setLoadError(null);
      try {
        const result = await getComments({ courseId, page: pageNum });
        setComments((prev) => (append ? [...prev, ...result.comments] : result.comments));
        setTotalCount(result.totalCount);
        setHasMore(result.hasMore);
        setPage(pageNum);
        onCountChange?.(result.totalCount);
      } catch (err) {
        setLoadError(err.message || "Something went wrong loading comments.");
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [courseId, onCountChange]
  );

  // Reload from page 1 whenever the course changes (e.g. navigating between courses)
  useEffect(() => {
    loadPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleLoadMore = () => loadPage(page + 1, true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCommentBody.trim() || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await createComment({ courseId, body: newCommentBody.trim(), token });
      setComments((prev) => [created, ...prev]);
      setTotalCount((prev) => {
        const next = prev + 1;
        onCountChange?.(next);
        return next;
      });
      setNewCommentBody("");
    } catch (err) {
      setSubmitError(err.message || "Failed to post your comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async (comment) => {
    if (!isAuthenticated) {
      setLikeError("Log in to like comments.");
      return;
    }
    // Guards against duplicate likes from rapid/double clicks on the same comment
    if (likePendingIds.has(comment.id)) return;

    setLikePendingIds((prev) => new Set(prev).add(comment.id));
    setLikeError(null);

    const wasLiked = comment.likedByCurrentUser;
    const previousCount = comment.likeCount;

    // Optimistic update so the UI feels instant
    setComments((prev) =>
      prev.map((c) =>
        c.id === comment.id
          ? { ...c, likedByCurrentUser: !wasLiked, likeCount: c.likeCount + (wasLiked ? -1 : 1) }
          : c
      )
    );

    try {
      const action = wasLiked ? unlikeComment : likeComment;
      const result = await action({ commentId: comment.id, courseId, token });
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id
            ? { ...c, likeCount: result.likeCount, likedByCurrentUser: result.likedByCurrentUser }
            : c
        )
      );
    } catch (err) {
      // Revert the optimistic update if the request actually failed
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id ? { ...c, likedByCurrentUser: wasLiked, likeCount: previousCount } : c
        )
      );
      setLikeError(err.message || "Failed to update like. Please try again.");
    } finally {
      setLikePendingIds((prev) => {
        const next = new Set(prev);
        next.delete(comment.id);
        return next;
      });
    }
  };

  return (
    <div className="mt-6 border-t border-slate-200 pt-4">
      <h2 className="text-sm font-semibold text-slate-900">
        Discussion{totalCount > 0 && ` (${totalCount})`}
      </h2>

      {/* Composer — hidden behind auth gating */}
      <div className="mt-3">
        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
            <input
              value={newCommentBody}
              onChange={(e) => setNewCommentBody(e.target.value)}
              placeholder="Add a public comment..."
              disabled={submitting}
              aria-label="Add a public comment"
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#12234F] disabled:bg-slate-50"
            />
            <button
              type="submit"
              disabled={submitting || !newCommentBody.trim()}
              className="flex items-center justify-center gap-1.5 rounded-md bg-[#12234F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0D1938] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12234F] focus-visible:ring-offset-2"
            >
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Comment
            </button>
          </form>
        ) : (
          <p className="rounded-md bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
            <a href="/login" className="font-medium text-[#12234F] hover:underline">
              Log in
            </a>{" "}
            to join the discussion.
          </p>
        )}
        {submitError && (
          <p role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5" />
            {submitError}
          </p>
        )}
      </div>

      {likeError && (
        <p role="alert" className="mt-2 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5" />
          {likeError}
        </p>
      )}

      {/* Comment list */}
      <div className="mt-4 space-y-4">
        {initialLoading && (
          <div className="flex items-center gap-2 py-6 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading comments...
          </div>
        )}

        {!initialLoading && loadError && (
          <div className="flex flex-col items-center gap-2 rounded-md bg-red-50 py-6 text-center">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-600">{loadError}</p>
            <button
              type="button"
              onClick={() => loadPage(1, false)}
              className="text-sm font-medium text-[#12234F] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12234F] rounded"
            >
              Try again
            </button>
          </div>
        )}

        {!initialLoading && !loadError && comments.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-slate-400">
            <MessageSquare className="h-6 w-6" />
            <p className="text-sm">No comments yet — be the first to start the discussion.</p>
          </div>
        )}

        {!initialLoading &&
          !loadError &&
          comments.map((comment) => (
            <CommentRow
              key={comment.id}
              comment={comment}
              onToggleLike={handleToggleLike}
              likePending={likePendingIds.has(comment.id)}
            />
          ))}

        {hasMore && !initialLoading && !loadError && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="flex items-center gap-1.5 rounded-full border border-[#12234F] px-4 py-1.5 text-xs font-medium text-[#12234F] hover:bg-[#12234F] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12234F] focus-visible:ring-offset-2"
            >
              {loadingMore && <Loader2 className="h-3 w-3 animate-spin" />}
              Load more comments
            </button>
          </div>
        )}
      </div>
    </div>
  );
}