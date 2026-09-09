import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MyCourses() {
  const navigate = useNavigate();

  const [enrolledCourses] = useState(() => {
    const saved = localStorage.getItem("learnhub_enrolled_courses");

    if (!saved) {
      return [];
    }

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  const getProgress = (courseId) => {
    const savedProgress = localStorage.getItem(
      `learnhub_progress_${courseId}`
    );

    if (!savedProgress) {
      return 0;
    }

    try {
      const completedLessons = JSON.parse(savedProgress);

      if (!Array.isArray(completedLessons)) {
        return 0;
      }

      const totalLessons = 8;

      return Math.round(
        (completedLessons.length / totalLessons) * 100
      );
    } catch {
      return 0;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/dashboard"
            className="text-2xl font-extrabold text-blue-600"
          >
            LearnHub
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              to="/dashboard"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Dashboard
            </Link>

            <Link
              to="/courses"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Courses
            </Link>

            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              My Courses
            </span>

            <Link
              to="/profile"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Profile
            </Link>

            <Link
              to="/community"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Community
            </Link>

            <Link
              to="/subscription"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Subscription
            </Link>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Learning Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
            My Courses
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Continue learning from where you stopped.
          </p>
        </div>

        {/* EMPTY STATE */}
        {enrolledCourses.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              📚
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              No courses yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              You haven't enrolled in any courses yet. Explore our courses
              and start learning today.
            </p>

            <button
              type="button"
              onClick={() => navigate("/courses")}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => {
              const progress = getProgress(course.id);

              return (
                <div
                  key={course.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* COURSE ICON */}
                  <div className="flex h-40 items-center justify-center bg-blue-50 text-6xl">
                    {course.icon || "📚"}
                  </div>

                  {/* COURSE CONTENT */}
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                        {course.category || "Education"}
                      </span>

                      <span className="text-xs font-semibold text-slate-500">
                        {course.level || "All Levels"}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900">
                      {course.title || course.name || "Course"}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Tutor: {course.tutor || "LearnHub Tutor"}
                    </p>

                    {/* PROGRESS */}
                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-600">
                          Progress
                        </span>

                        <span className="text-sm font-bold text-blue-600">
                          {progress}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* BUTTON */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/learning/${course.id}`)
                      }
                      className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
                    >
                      {progress === 100
                        ? "Review Course"
                        : "Continue Learning"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyCourses;