import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient, ApiError } from "../services/apiClient";

function TutorProfile() {
  const { id } = useParams();

  const [tutor, setTutor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTutor = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get(`/tutors/${id}`);

      setTutor(response?.tutor || response);
      setCourses(response?.courses || []);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Unable to load this tutor. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-5xl px-6 py-12">
          <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-8">
            <div className="h-20 w-20 rounded-full bg-slate-200" />
            <div className="mt-5 h-7 w-56 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-40 rounded bg-slate-200" />
            <div className="mt-6 h-20 w-full rounded bg-slate-200" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-5xl px-6 py-12">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="text-2xl font-bold text-red-800">
              Unable to load tutor
            </h1>

            <p className="mt-2 text-red-700">{error}</p>

            <button
              type="button"
              onClick={loadTutor}
              className="mt-5 rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  const tutorName =
    tutor?.name || tutor?.fullName || "LearnHub Tutor";

  const tutorSubject =
    tutor?.subject || tutor?.category || "General Education";

  const tutorBio =
    tutor?.bio || "This tutor has not added a biography yet.";

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link
          to="/tutors"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Back to Tutors
        </Link>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-extrabold text-blue-700">
                {tutorName.charAt(0).toUpperCase()}
              </div>

              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">
                  {tutorName}
                </h1>

                <p className="mt-1 font-semibold text-blue-600">
                  {tutorSubject}
                </p>
              </div>
            </div>

            <Link
              to={`/tutors/${id}/support`}
              className="rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Support This Tutor
            </Link>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <h2 className="text-lg font-bold text-slate-900">About</h2>

            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              {tutorBio}
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Published Courses
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
              Courses by {tutorName}
            </h2>
          </div>

          {courses.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <h3 className="text-lg font-bold text-slate-900">
                No published courses yet
              </h3>

              <p className="mt-2 text-slate-600">
                This tutor has not published any courses yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                const courseId = course.id || course._id;

                return (
                  <article
                    key={courseId}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="h-40 bg-slate-200">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title || "Course"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-500">
                          Course
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-900">
                        {course.title || "Untitled Course"}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                        {course.description ||
                          "Explore this course on LearnHub."}
                      </p>

                      {courseId && (
                        <Link
                          to={`/courses/${courseId}`}
                          className="mt-5 block rounded-xl border border-blue-600 px-4 py-3 text-center text-sm font-bold text-blue-600 transition hover:bg-blue-50"
                        >
                          View Course
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default TutorProfile;