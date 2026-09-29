import { useMemo, useState } from "react";
import { Search, ThumbsUp, Clock } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { CATEGORIES, SORT_OPTIONS, MOCK_COURSES, formatPrice } from "../data/mockCourses";

export default function CourseDiscovery({ courses = MOCK_COURSES, onLoadMore, hasMore = true }) {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popular");
  const [query, setQuery] = useState("");

  const visibleCourses = useMemo(() => {
    let list = courses.filter((c) => category === "All" || c.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) => c.title.toLowerCase().includes(q) || c.tutor.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "price_low":
        list = [...list].sort((a, b) => a.priceFcfa - b.priceFcfa);
        break;
      case "price_high":
        list = [...list].sort((a, b) => b.priceFcfa - a.priceFcfa);
        break;
      case "newest":
        list = [...list].reverse();
        break;
      default:
        list = [...list].sort((a, b) => b.likes - a.likes);
    }
    return list;
  }, [courses, category, sort, query]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header activePage="courses" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">Explore Courses</h1>
        <p className="mt-1 text-sm text-slate-500">
          Discover high-quality, locally relevant skills taught by expert Cameroonian tutors.
        </p>

        {/* Filter row */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-colors " +
                  (category === cat
                    ? "bg-[#12234F] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200")
                }
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-32 bg-transparent text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-600 focus:outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort: {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course grid */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleCourses.map((course) => (
            <a
              key={course.id}
              href={`/courses/${course.id}`}
              className="group overflow-hidden rounded-lg border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                {course.badge && (
                  <span className="absolute left-2 top-2 rounded bg-[#F0A93B] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {course.badge}
                  </span>
                )}
                <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
                  <Clock className="h-2.5 w-2.5" />
                  {course.durationLabel}
                </span>
              </div>

              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
                  {course.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{course.tutor}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#12234F]">
                    {formatPrice(course.priceFcfa)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <ThumbsUp className="h-3 w-3" />
                    {course.likes.toLocaleString()}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {visibleCourses.length === 0 && (
          <p className="mt-10 text-center text-sm text-slate-500">
            No courses match your filters yet.
          </p>
        )}

        {hasMore && visibleCourses.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={onLoadMore}
              className="rounded-full border border-[#12234F] px-6 py-2 text-sm font-medium text-[#12234F] hover:bg-[#12234F] hover:text-white transition-colors"
            >
              Load More Courses
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}