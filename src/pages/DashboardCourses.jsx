import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";

function DashboardCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  const loadCourses = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/courses");

      const data =
        response?.data?.courses ??
        response?.courses ??
        response?.data ??
        response;

      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load your courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const updateStatus = async (courseId, status) => {
    setActionId(courseId);
    setError("");

    try {
      const response = await apiFetch(`/courses/${courseId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
        }),
      });

      const updatedCourse =
        response?.data?.course ??
        response?.course ??
        null;

      setCourses((currentCourses) =>
        currentCourses.map((course) => {
          const currentId = course.id || course._id;

          if (currentId !== courseId) {
            return course;
          }

          return updatedCourse
            ? updatedCourse
            : {
                ...course,
                status,
              };
        })
      );
    } catch (err) {
      setError(
        err.message ||
          `Unable to change the course status to ${status}.`
      );
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (courseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) {
      return;
    }

    setActionId(courseId);
    setError("");

    try {
      await apiFetch(`/courses/${courseId}`, {
        method: "DELETE",
      });

      setCourses((currentCourses) =>
        currentCourses.filter(
          (course) => (course.id || course._id) !== courseId
        )
      );
    } catch (err) {
      setError(err.message || "Unable to delete this course.");
    } finally {
      setActionId(null);
    }
  };

  const getStatusClass = (status) => {
    if (status === "published") {
      return "bg-green-50 text-green-700";
    }

    return "bg-yellow-50 text-yellow-700";
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              to="/dashboard"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Back to dashboard
            </Link>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-600">
              Tutor Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              My Courses
            </h1>

            <p className="mt-3 text-slate-600">
              Create, edit, publish, manage, and delete your courses.
            </p>
          </div>

          <Link
            to="/dashboard/courses/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Create course
          </Link>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl bg-white p-6 shadow-sm"
              >
                <div className="h-40 rounded-lg bg-slate-200" />
                <div className="mt-5 h-6 w-3/4 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-full rounded bg-slate-200" />
                <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <section className="mt-8 rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              You have no courses yet
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-slate-600">
              Create your first course and save it as a draft or publish it
              for learners.
            </p>

            <Link
              to="/dashboard/courses/new"
              className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create your first course
            </Link>
          </section>
        ) : (
          <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const courseId = course.id || course._id;
              const status =
                course.status === "published"
                  ? "published"
                  : "draft";

              const isActing = actionId === courseId;

              const thumbnail =
                course.thumbnailUrl || course.thumbnail;

              const likeCount =
                course.likesCount ??
                course.likeCount ??
                course.likes ??
                0;

              const commentCount =
                course.commentsCount ??
                course.commentCount ??
                course.comments ??
                0;

              const views =
                course.views ??
                course.viewCount ??
                0;

              const earnings =
                course.earnings ??
                course.totalEarnings ??
                0;

              return (
                <article
                  key={courseId}
                  className="overflow-hidden rounded-xl bg-white shadow-sm"
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={course.title || "Course"}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-slate-100 text-sm font-medium text-slate-500">
                      No thumbnail
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {course.category && (
                          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                            {course.category}
                          </p>
                        )}

                        <h2 className="mt-2 text-xl font-semibold text-slate-900">
                          {course.title || "Untitled course"}
                        </h2>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {course.description ||
                        "No course description available."}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 text-sm">
                      <div>
                        <p className="text-slate-500">Views</p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {views}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">Likes</p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {likeCount}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">Comments</p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {commentCount}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">Earnings</p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {earnings} FCFA
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <Link
                        to={`/dashboard/courses/${courseId}/edit`}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600"
                      >
                        Edit
                      </Link>

                      {status === "draft" ? (
                        <button
                          type="button"
                          onClick={() =>
                            updateStatus(courseId, "published")
                          }
                          disabled={isActing}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isActing
                            ? "Updating..."
                            : "Publish"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            updateStatus(courseId, "draft")
                          }
                          disabled={isActing}
                          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-yellow-500 hover:text-yellow-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isActing
                            ? "Updating..."
                            : "Set as draft"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(courseId)}
                        disabled={isActing}
                        className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isActing ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

export default DashboardCourses;