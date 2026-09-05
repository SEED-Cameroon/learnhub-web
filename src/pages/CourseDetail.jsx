import { useState } from "react";
import { Play, ThumbsUp, Share2, CheckCircle2, Lock, PlayCircle } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CommentRow from "../components/comments/CommentRow";
import { MOCK_COURSE } from "../data/mockCourses";

const TABS = ["Description", "Comments", "Resources"];

export default function CourseDetail({ course = MOCK_COURSE, onSupportTutor, onFollow, onSubmitComment }) {
  const [activeTab, setActiveTab] = useState("Description");
  const [comment, setComment] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSubmit = () => {
    if (!comment.trim()) return;
    onSubmitComment?.(comment.trim());
    setComment("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header activePage="courses" />

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-900">
            {isPlaying && course.youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${course.youtubeId}?autoplay=1&rel=0`}
                title={course.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            ) : isPlaying && course.videoUrl ? (
              <video
                src={course.videoUrl}
                poster={course.thumbnail}
                controls
                autoPlay
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover opacity-80"
                />
                <button
                  type="button"
                  aria-label="Play video"
                  onClick={() => setIsPlaying(true)}
                  disabled={!course.youtubeId && !course.videoUrl}
                  className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#12234F]/90 text-white hover:bg-[#12234F] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Play className="h-6 w-6 fill-white" />
                </button>
                {!course.youtubeId && !course.videoUrl && (
                  <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/70">
                    No video source set for this lesson
                  </p>
                )}
              </>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
              {course.category}
            </span>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
              {course.level}
            </span>
          </div>

          <h1 className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl">{course.title}</h1>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/40?img=12"
                alt={course.tutor.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="flex items-center gap-1 text-sm font-semibold text-slate-900">
                  {course.tutor.name}
                  {course.tutor.verified && <CheckCircle2 className="h-3.5 w-3.5 text-[#12234F]" />}
                </p>
                <p className="text-xs text-slate-500">{course.tutor.students} Students</p>
              </div>
              <button
                onClick={onFollow}
                className="ml-2 rounded-full border border-slate-300 px-4 py-1 text-xs font-medium text-slate-700 hover:border-[#12234F] hover:text-[#12234F]"
              >
                Follow
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 hover:border-[#12234F]">
                <ThumbsUp className="h-3.5 w-3.5" />
                {course.likes}
              </button>
              <button className="flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 hover:border-[#12234F]">
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>
              <button
                onClick={onSupportTutor}
                className="rounded-full bg-[#F0A93B] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#D9931E]"
              >
                Support Tutor
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-6 border-b border-slate-200">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={
                  "pb-2 text-sm font-medium " +
                  (activeTab === tab
                    ? "border-b-2 border-[#12234F] text-[#12234F]"
                    : "text-slate-500 hover:text-slate-700")
                }
              >
                {tab}
                {tab === "Comments" && ` (${course.comments.length})`}
              </button>
            ))}
          </div>

          {activeTab === "Description" && (
            <div className="mt-4">
              {course.description.map((para, i) => (
                <p key={i} className="mt-2 text-sm leading-relaxed text-slate-600 first:mt-0">
                  {para}
                </p>
              ))}

              <h2 className="mt-5 text-sm font-semibold text-slate-900">Key Learnings</h2>
              <ul className="mt-2 space-y-1.5">
                {course.keyLearnings.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#12234F]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "Resources" && (
            <p className="mt-4 text-sm text-slate-500">No downloadable resources for this lesson yet.</p>
          )}

          {activeTab === "Comments" && (
            <div className="mt-4 space-y-4">
              {course.comments.map((c) => (
                <CommentRow key={c.id} comment={c} />
              ))}
            </div>
          )}

          {/* Discussion — always visible per design, independent of tab */}
          <div className="mt-6 border-t border-slate-200 pt-4">
            <h2 className="text-sm font-semibold text-slate-900">Discussion</h2>
            <div className="mt-3 flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Add a public comment..."
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#12234F]"
              />
              <button
                onClick={handleSubmit}
                className="rounded-md bg-[#12234F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0D1938]"
              >
                Comment
              </button>
            </div>

            {activeTab !== "Comments" && (
              <div className="mt-4 space-y-4">
                {course.comments.map((c) => (
                  <CommentRow key={c.id} comment={c} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="h-fit rounded-lg border border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900">Course Content</h2>
          <ul className="mt-3 space-y-3">
            {course.content.map((lesson) => (
              <li key={lesson.id} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-slate-100">
                  {lesson.status === "playing" ? (
                    <PlayCircle className="h-4 w-4 text-[#12234F]" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </div>
                <div>
                  <p
                    className={
                      "text-xs font-medium " +
                      (lesson.status === "playing" ? "text-[#12234F]" : "text-slate-700")
                    }
                  >
                    {lesson.title}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {lesson.duration}
                    {lesson.status === "playing" && " · Playing now"}
                    {lesson.status === "up_next" && " · Up Next"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </main>

      <Footer />
    </div>
  );
}