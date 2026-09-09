import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../services/apiClient";
import { useAuth } from "../context/AuthContext";

function getCourseImage(course) {
  return course?.thumbnail || course?.image || course?.coverImage || null;
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

function getTutorId(course) {
  if (typeof course?.tutor === "object") {
    return course?.tutor?.id || course?.tutor?._id;
  }

  return course?.tutorId;
}

function getCategory(course) {
  return course?.category?.name || course?.category || "General";
}

function getLessons(course) {
  if (Array.isArray(course?.lessons)) {
    return course.lessons;
  }

  if (Array.isArray(course?.curriculum)) {
    return course.curriculum;
  }

  return [];
}

function getLessonTitle(lesson, index) {
  if (typeof lesson === "string") {
    return lesson;
  }

  return (
    lesson?.title ||
    lesson?.name ||
    `Lesson ${index + 1}`
  );
}

function LoadingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-32 rounded bg-slate-200" />
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              <div className="h-12 w-3/4 rounded bg-slate-200" />
              <div className="h-5 w-1/2 rounded bg-slate-200" />
              <div className="h-64 rounded-2xl bg-slate-200" />
              <div className="h-32 rounded-2xl bg-slate-200" />
            </div>

            <div className="h-80 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
          LearnHub
        </p>

        <h1 className="mt-3 text-4xl font-extrabold text-slate-900">
          Course Not Found
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          The course you are looking for does not exist or is no longer
          available.
        </p>

        <Link
          to="/courses"
          className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
        >
          Back to Courses
        </Link>
      </div>
    </main>
  );
}

function CourseDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourse = async () => {
    setLoading(true);
    setError("");
    setCourse(null);

    try {
      const response = await apiClient.get(`/courses/${id}`);

      const courseData =
        response?.course ||
        response?.data ||
        response;

      if (!courseData) {
        setCourse(null);
        return;
      }

      setCourse(courseData);
    } catch (err) {
      if (err?.status === 404) {
        setCourse(null);
      } else {
        setError(
          err?.message ||
            "Unable to load this course. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [id]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!course && !error) {
    return <CourseNotFound />;
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-800">
            Unable to Load Course
          </h1>

          <p className="mt-3 text-sm leading-6 text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={loadCourse}
            className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  const image = getCourseImage(course);
  const tutorName = getTutorName(course);
  const tutorId = getTutorId(course);
  const category = getCategory(course);
  const lessons = getLessons(course);

  const lessonCount =
    course?.lessonCount ??
    course?.lessonsCount ??
    lessons.length;

  const studentCount =
    course?.studentCount ??
    course?.studentsCount ??
    course?.enrollmentCount;

  const likeCount =
    course?.likeCount ??
    course?.likesCount ??
    course?.likes ??
    0;

  const comments = Array.isArray(course?.comments)
    ? course.comments
    : [];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            to="/courses"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Back to Courses
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {category}
                </span>

                {course?.level && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {course.level}
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                {course?.title || "Untitled Course"}
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                {course?.description ||
                  "No course description is available."}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                <span>
                  Tutor:{" "}
                  <strong className="text-slate-700">
                    {tutorName}
                  </strong>
                </span>

                {course?.duration && (
                  <span>
                    Duration:{" "}
                    <strong className="text-slate-700">
                      {course.duration}
                    </strong>
                  </span>
                )}

                {studentCount !== undefined && (
                  <span>
                    Students:{" "}
                    <strong className="text-slate-700">
                      {studentCount}
                    </strong>
                  </span>
                )}

                <span>
                  Likes:{" "}
                  <strong className="text-slate-700">
                    {likeCount}
                  </strong>
                </span>
              </div>
            </div>

            <aside>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-56 bg-slate-100">
                  {image ? (
                    <img
                      src={image}
                      alt={course?.title || "Course"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center">
                      <span className="text-sm font-semibold text-slate-400">
                        LearnHub Course
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {course?.price !== undefined &&
                    course?.price !== null && (
                      <p className="text-2xl font-extrabold text-slate-900">
                        {course.price === 0
                          ? "Free"
                          : `${course.price} FCFA`}
                      </p>
                    )}

                  <button
                    type="button"
                    disabled={!isAuthenticated}
                    className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isAuthenticated
                      ? "Start Learning"
                      : "Log in to Start Learning"}
                  </button>

                  {!isAuthenticated && (
                    <Link
                      to="/login"
                      className="mt-3 block text-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Log in to access course actions
                    </Link>
                  )}

                  <div className="mt-6 border-t border-slate-200 pt-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">
                        Lessons
                      </span>

                      <span className="font-semibold text-slate-700">
                        {lessonCount}
                      </span>
                    </div>

                    {course?.level && (
                      <div className="mt-3 flex justify-between text-sm">
                        <span className="text-slate-500">
                          Level
                        </span>

                        <span className="font-semibold text-slate-700">
                          {course.level}
                        </span>
                      </div>
                    )}

                    {course?.duration && (
                      <div className="mt-3 flex justify-between text-sm">
                        <span className="text-slate-500">
                          Duration
                        </span>

                        <span className="font-semibold text-slate-700">
                          {course.duration}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">
                About This Course
              </h2>

              <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">
                {course?.about ||
                  course?.longDescription ||
                  course?.description ||
                  "No additional course information is available."}
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Course Curriculum
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {lessonCount} lesson
                    {lessonCount === 1 ? "" : "s"} included in
                    this course.
                  </p>
                </div>
              </div>

              {lessons.length > 0 ? (
                <div className="mt-6 space-y-3">
                  {lessons.map((lesson, index) => (
                    <div
                      key={
                        lesson?.id ||
                        lesson?._id ||
                        `${getLessonTitle(lesson, index)}-${index}`
                      }
                      className="flex items-center gap-4 rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                        {index + 1}
                      </div>

                      <span className="font-medium text-slate-700">
                        {getLessonTitle(lesson, index)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-xl bg-slate-50 p-6 text-center">
                  <p className="text-sm text-slate-500">
                    Course lessons will appear here when available.
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Community
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {likeCount} likes and {comments.length} comments
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!isAuthenticated}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAuthenticated ? "Like Course" : "Log in to Like"}
                </button>
              </div>

              <div className="mt-6">
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment, index) => (
                      <div
                        key={
                          comment?.id ||
                          comment?._id ||
                          `comment-${index}`
                        }
                        className="rounded-xl bg-slate-50 p-4"
                      >
                        <p className="font-semibold text-slate-800">
                          {comment?.user?.name ||
                            comment?.user?.fullName ||
                            comment?.userName ||
                            "LearnHub User"}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {comment?.content ||
                            comment?.text ||
                            ""}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-slate-50 p-6 text-center">
                    <p className="text-sm text-slate-500">
                      No comments yet.
                    </p>
                  </div>
                )}
              </div>

              {isAuthenticated ? (
                <div className="mt-6">
                  <textarea
                    rows="4"
                    placeholder="Write a comment..."
                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    disabled
                    className="mt-3 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white opacity-50"
                  >
                    Post Comment
                  </button>
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-slate-200 p-5">
                  <p className="text-sm text-slate-600">
                    Log in to like this course or participate in
                    the discussion.
                  </p>

                  <Link
                    to="/login"
                    className="mt-3 inline-block text-sm font-bold text-blue-600 hover:text-blue-700"
                  >
                    Log in
                  </Link>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                What You'll Learn
              </h2>

              <ul className="mt-5 space-y-4">
                <li className="flex gap-3 text-sm leading-6 text-slate-600">
                  <span className="font-bold text-green-600">
                    ✓
                  </span>
                  <span>Understand the fundamentals of the subject.</span>
                </li>

                <li className="flex gap-3 text-sm leading-6 text-slate-600">
                  <span className="font-bold text-green-600">
                    ✓
                  </span>
                  <span>Follow structured lessons at your own pace.</span>
                </li>

                <li className="flex gap-3 text-sm leading-6 text-slate-600">
                  <span className="font-bold text-green-600">
                    ✓
                  </span>
                  <span>Practice concepts through practical examples.</span>
                </li>

                <li className="flex gap-3 text-sm leading-6 text-slate-600">
                  <span className="font-bold text-green-600">
                    ✓
                  </span>
                  <span>Learn from tutors on LearnHub.</span>
                </li>

                <li className="flex gap-3 text-sm leading-6 text-slate-600">
                  <span className="font-bold text-green-600">
                    ✓
                  </span>
                  <span>Build knowledge through guided learning.</span>
                </li>
              </ul>
            </section>

            {tutorId && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                  Your Tutor
                </h2>

                <p className="mt-3 text-sm text-slate-600">
                  Learn more about {tutorName} and explore their
                  published courses.
                </p>

                <Link
                  to={`/tutors/${tutorId}`}
                  className="mt-5 block rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-center text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                >
                  View Tutor Profile
                </Link>
              </section>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

export default CourseDetails;