import { ThumbsUp } from "lucide-react";

export default function CommentRow({ comment }) {
  return (
    <div className="flex gap-3">
      <img
        src="https://i.pravatar.cc/32?u=commenter"
        alt={comment.author}
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
      <div>
        <p className="text-xs font-semibold text-slate-900">
          {comment.author} <span className="ml-1 font-normal text-slate-400">{comment.timeAgo}</span>
        </p>
        <p className="mt-0.5 text-sm text-slate-600">{comment.body}</p>
        <div className="mt-1 flex gap-4 text-xs text-slate-400">
          <button className="flex items-center gap-1 hover:text-[#12234F]">
            <ThumbsUp className="h-3 w-3" />
            {comment.likes}
          </button>
          <button className="hover:text-[#12234F]">Reply</button>
        </div>
      </div>
    </div>
  );
}