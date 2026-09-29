import { ThumbsUp } from "lucide-react";

function formatTimeAgo(isoString) {
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommentRow({ comment, onToggleLike, likePending }) {
  const avatarSrc =
    comment.author.avatarUrl || `https://i.pravatar.cc/32?u=${encodeURIComponent(comment.author.name)}`;

  return (
    <div className="flex gap-3">
      <img
        src={avatarSrc}
        alt={comment.author.name}
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
      <div className="flex-1">
        <p className="text-xs font-semibold text-slate-900">
          {comment.author.name}{" "}
          <span className="ml-1 font-normal text-slate-400">{formatTimeAgo(comment.createdAt)}</span>
        </p>
        <p className="mt-0.5 text-sm text-slate-600">{comment.body}</p>

        <button
          type="button"
          onClick={() => onToggleLike(comment)}
          disabled={likePending}
          aria-pressed={comment.likedByCurrentUser}
          aria-label={comment.likedByCurrentUser ? "Unlike this comment" : "Like this comment"}
          className={
            "mt-1 flex items-center gap-1 rounded px-1.5 py-0.5 text-xs transition-colors " +
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12234F] " +
            "disabled:cursor-not-allowed disabled:opacity-50 " +
            (comment.likedByCurrentUser
              ? "font-medium text-[#12234F]"
              : "text-slate-400 hover:text-[#12234F]")
          }
        >
          <ThumbsUp className={"h-3 w-3 " + (comment.likedByCurrentUser ? "fill-[#12234F]" : "")} />
          {comment.likeCount}
        </button>
      </div>
    </div>
  );
}