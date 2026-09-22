import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function TutorProfile() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [tutor, setTutor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const loadTutor = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch(`/tutors/${id}`);

      const tutorData = response?.data?.tutor ?? response?.tutor;
      const coursesData =
        response?.data?.courses ??
        response?.courses ??
        [];

      if (!tutorData) {
        throw new Error("Tutor not found.");
      }

      setTutor(tutorData);
      setCourses(Array.isArray(coursesData) ? coursesData : []);

      setFollowing(
        Boolean(
          tutorData.isFollowing ??
            tutorData.following ??
            tutorData.isFollowed
        )
      );
    } catch (err) {
      setError(err.message || "Unable to load this tutor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutor();
  }, [id]);

  const handleFollow = async () => {
    if (!isAuthenticated || followLoading) {
      return;
    }

    const tutorId = tutor?.id || tutor?._id;

    if (!tutorId) {
      return;
    }

    setFollowLoading(true);
    setError("");

    try {
      if (following) {
        await apiFetch(`/users/${tutorId}/follow`, {
          method: "DELETE",
        });
      } else {
        await apiFetch(`/users/${tutorId}/follow`, {
          method: "POST",
        });
      }

      setFollowing((currentFollowing) => !currentFollowing);
    } catch (err) {
      setError(err.message || "Unable to update your follow status.");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-10 w-48 rounded bg-slate-200" />
          <div className="mt-6 h-48 rounded-xl bg-slate-200" />

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 rounded-xl bg-slate-200"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !tutor) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-6xl rounded-xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-bold text-red-800">
            Tutor not found
          </h1>

          <p className="mt-2 text-red-700">
            {error || "This tutor could not be found."}
          </p>

          <Link
            to="/tutors"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to tutors
          </Link>
        </div>
      </main>
    );
  }

  const subjectTags =
    tutor.subjectTags ||
    tutor.subjects ||
    [];

  const followerCount =
    tutor.followerCount ??
    tutor.followersCount ??
    tutor.followers ??
    0;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/tutors"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Back to tutors
        </Link>

        <section className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="h-32 bg-slate-900 sm:h-44" />

          <div className="px-6 pb-8 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                {tutor.avatarUrl || tutor.avatar ? (
                  <img
                    src={tutor.avatarUrl || tutor.avatar}
                    alt={tutor.name || "Tutor"}
                    className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm sm:h-28 sm:w-28"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-3xl font-bold text-blue-700 shadow-sm sm:h-28 sm:w-28">
                    {(tutor.name || "T").charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="pb-1">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    {tutor.name || "Tutor"}
                  </h1>

                  {tutor.email && (
                    <p className="mt-1 text-sm text-slate-500">
                      {tutor.email}
                    </p>
                  )}

                  <p className="mt-2 text-sm text-slate-500">
                    {followerCount}{" "}
                    {followerCount === 1 ? "follower" : "followers"}
                  </p>
                </div>
              </div>

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`rounded-lg px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    following
                      ? "border border-slate-300 bg-white text-slate-700 hover:border-red-300 hover:text-red-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {followLoading
                    ? "Updating..."
                    : following
                      ? "Unfollow"
                      : "Follow tutor"}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Log in to follow
                </Link>
              )}
            </div>

            {tutor.bio && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-slate-900">
                  About this tutor
                </h2>

                <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                  {tutor.bio}
                </p>
              </div>
            )}

            {subjectTags.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Subjects
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {subjectTags.map((subject) => (
                    <span
                      key={subject}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}
          </div>
        </section>

        <section className="mt-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Published courses
            </h2>

            <p className="mt-2 text-slate-600">
              Explore courses published by {tutor.name || "this tutor"}.
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-slate-600">
                This tutor has no published courses yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                const courseId = course.id || course._id;

                return (
                  <Link
                    key={courseId}
                    to={`/courses/${courseId}`}
                    className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    {(course.thumbnailUrl || course.thumbnail) && (
                      <img
                        src={course.thumbnailUrl || course.thumbnail}
                        alt={course.title || "Course"}
                        className="h-44 w-full object-cover"
                      />
                    )}

                    <div className="p-5">
                      {course.category && (
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                          {course.category}
                        </p>
                      )}

                      <h3 className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-blue-600">
                        {course.title || "Untitled course"}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                        {course.description ||
                          "No course description available."}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="font-semibold text-slate-900">
                          {course.price ?? 0} FCFA
                        </span>

                        <span className="text-sm font-semibold text-blue-600">
                          View course
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default TutorProfile;