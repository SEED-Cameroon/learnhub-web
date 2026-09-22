import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/courses");
      const data = response?.data ?? response;

      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const categories = useMemo(() => {
    const values = courses
      .map((course) => course.category)
      .filter(Boolean);

    return ["all", ...new Set(values)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (category === "all") {
      return courses;
    }

    return courses.filter((course) => course.category === category);
  }, [courses, category]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Explore Courses
            </h1>

            <p className="mt-2 text-slate-600">
              Discover courses and learn from tutors on LearnHub.
            </p>
          </div>

          {!loading && !error && courses.length > 0 && (
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-600"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "All categories" : item}
                </option>
              ))}
            </select>
          )}
        </div>

        {loading && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <div className="h-48 bg-slate-200" />

                <div className="p-6">
                  <div className="h-5 w-3/4 rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-full rounded bg-slate-200" />
                  <div className="mt-2 h-4 w-4/5 rounded bg-slate-200" />
                  <div className="mt-5 h-10 w-28 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-semibold text-red-800">
              Unable to load courses
            </h2>

            <p className="mt-2 text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={loadCourses}
              className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && filteredCourses.length === 0 && (
          <div className="mt-10 rounded-xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              No courses found
            </h2>

            <p className="mt-2 text-slate-600">
              There are no courses available in the selected category.
            </p>
          </div>
        )}

        {!loading && !error && filteredCourses.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <article
                key={course.id}
                className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title || "Course"}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-slate-100 text-sm text-slate-500">
                    No course image
                  </div>
                )}

                <div className="p-6">
                  {course.category && (
                    <p className="text-sm font-medium text-blue-600">
                      {course.category}
                    </p>
                  )}

                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    {course.title || "Untitled course"}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {course.description ||
                      "No course description available."}
                  </p>

                  <Link
                    to={`/courses/${course.id}`}
                    className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    View course
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Courses;