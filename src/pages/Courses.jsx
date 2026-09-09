import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../services/apiClient";

const COURSES_PER_PAGE = 8;

function getCourseId(course) {
  return course?.id ?? course?._id;
}

function getTutorName(course) {
  if (typeof course?.tutor === "string") {
    return course.tutor;
  }

  return (
    course?.tutor?.name ||
    course?.tutor?.fullName ||
    course?.tutorName ||
    "LearnHub Tutor"
  );
}

function getCourseImage(course) {
  return course?.thumbnail || course?.image || course?.coverImage || null;
}

function getCourseCategory(course) {
  return course?.category?.name || course?.category || "General";
}

function getCourseLevel(course) {
  return course?.level || "All Levels";
}

function getCoursePrice(course) {
  if (course?.price === undefined || course?.price === null) {
    return null;
  }

  return course.price;
}

function LoadingCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-48 animate-pulse bg-slate-200" />

      <div className="space-y-4 p-5">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}

function CourseCard({ course }) {
  const courseId = getCourseId(course);
  const tutorName = getTutorName(course);
  const category = getCourseCategory(course);
  const level = getCourseLevel(course);
  const image = getCourseImage(course);
  const price = getCoursePrice(course);

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={course?.title || "Course"}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-100 px-6 text-center">
            <span className="text-sm font-semibold text-slate-400">
              LearnHub Course
            </span>
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 shadow-sm">
          {category}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {level}
          </span>

          {price !== null && (
            <span className="text-sm font-bold text-blue-600">
              {price === 0 ? "Free" : `${price} FCFA`}
            </span>
          )}
        </div>

        <h2 className="line-clamp-2 text-xl font-bold text-slate-900">
          {course?.title || "Untitled Course"}
        </h2>

        <p className="mt-2 text-sm font-medium text-slate-500">
          {tutorName}
        </p>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {course?.description || "No course description available."}
        </p>

        <Link
          to={`/courses/${courseId}`}
          className="mt-5 block w-full rounded-xl bg-blue-600 px-4 py-3 text-center font-bold text-white transition hover:bg-blue-700"
        >
          View Course
        </Link>
      </div>
    </article>
  );
}

function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get("/courses");

      let courseList = [];

      if (Array.isArray(response)) {
        courseList = response;
      } else if (Array.isArray(response?.courses)) {
        courseList = response.courses;
      } else if (Array.isArray(response?.items)) {
        courseList = response.items;
      }

      setCourses(courseList);
    } catch (err) {
      setError(
        err?.message || "Unable to load courses. Please try again."
      );
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      courses.map((course) => getCourseCategory(course))
    );

    return ["All", ...Array.from(uniqueCategories).sort()];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = courses.filter((course) => {
      const title = String(course?.title || "").toLowerCase();
      const description = String(course?.description || "").toLowerCase();
      const tutor = getTutorName(course).toLowerCase();
      const courseCategory = getCourseCategory(course);

      const matchesSearch =
        !normalizedSearch ||
        title.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        tutor.includes(normalizedSearch);

      const matchesCategory =
        category === "All" || courseCategory === category;

      return matchesSearch && matchesCategory;
    });

    return [...result].sort((a, b) => {
      if (sort === "title-asc") {
        return String(a?.title || "").localeCompare(
          String(b?.title || "")
        );
      }

      if (sort === "title-desc") {
        return String(b?.title || "").localeCompare(
          String(a?.title || "")
        );
      }

      if (sort === "price-low") {
        return Number(a?.price || 0) - Number(b?.price || 0);
      }

      if (sort === "price-high") {
        return Number(b?.price || 0) - Number(a?.price || 0);
      }

      return 0;
    });
  }, [courses, search, category, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCourses.length / COURSES_PER_PAGE)
  );

  const visibleCourses = useMemo(() => {
    const startIndex = (page - 1) * COURSES_PER_PAGE;

    return filteredCourses.slice(
      startIndex,
      startIndex + COURSES_PER_PAGE
    );
  }, [filteredCourses, page]);

  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              LearnHub Courses
            </p>

            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Learn skills that move you forward
            </h1>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Explore courses from tutors and discover practical knowledge
              you can learn at your own pace.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto_auto]">
            <div>
              <label
                htmlFor="course-search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Search courses
              </label>

              <input
                id="course-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by course, tutor or topic"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="course-category"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Category
              </label>

              <select
                id="course-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="course-sort"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Sort
              </label>

              <select
                id="course-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="newest">Newest</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-bold text-red-800">
              Unable to load courses
            </h2>

            <p className="mt-2 text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={loadCourses}
              className="mt-5 rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredCourses.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              No courses found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-slate-600">
              Try changing your search or category filter to find available
              courses.
            </p>

            {(search || category !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {!loading && !error && filteredCourses.length > 0 && (
          <>
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Explore Courses
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Showing {visibleCourses.length} of {filteredCourses.length}{" "}
                  course{filteredCourses.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleCourses.map((course) => (
                <CourseCard
                  key={getCourseId(course)}
                  course={course}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                        page === pageNumber
                          ? "bg-blue-600 text-white"
                          : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default Courses;