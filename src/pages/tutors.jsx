import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";

function Tutors() {
  const [tutors, setTutors] = useState([]);
  const [subject, setSubject] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTutors = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/tutors");
      const data = response?.data ?? response;

      setTutors(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load tutors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutors();
  }, []);

  const subjects = useMemo(() => {
    const values = tutors.flatMap((tutor) => tutor.subjectTags || []);
    return ["all", ...new Set(values)];
  }, [tutors]);

  const filteredTutors = useMemo(() => {
    if (subject === "all") {
      return tutors;
    }

    return tutors.filter((tutor) =>
      (tutor.subjectTags || []).includes(subject)
    );
  }, [tutors, subject]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Find a Tutor
            </h1>

            <p className="mt-2 text-slate-600">
              Discover tutors and explore the subjects they teach.
            </p>
          </div>

          {!loading && !error && tutors.length > 0 && (
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-600"
            >
              {subjects.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "All subjects" : item}
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
                className="animate-pulse rounded-xl bg-white p-6 shadow-sm"
              >
                <div className="h-16 w-16 rounded-full bg-slate-200" />
                <div className="mt-5 h-5 w-2/3 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-full rounded bg-slate-200" />
                <div className="mt-2 h-4 w-4/5 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-semibold text-red-800">
              Unable to load tutors
            </h2>

            <p className="mt-2 text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={loadTutors}
              className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && filteredTutors.length === 0 && (
          <div className="mt-10 rounded-xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              No tutors found
            </h2>

            <p className="mt-2 text-slate-600">
              There are no tutors matching the selected subject.
            </p>
          </div>
        )}

        {!loading && !error && filteredTutors.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTutors.map((tutor) => (
              <article
                key={tutor.id}
                className="rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  {tutor.avatar ? (
                    <img
                      src={tutor.avatar}
                      alt={tutor.name || "Tutor"}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-xl font-semibold text-slate-500">
                      {(tutor.name || "T").charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      {tutor.name || "Tutor"}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {tutor.subjectTags?.[0] || "Tutor"}
                    </p>
                  </div>
                </div>

                <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
                  {tutor.bio || "This tutor has not added a bio yet."}
                </p>

                <Link
                  to={`/tutors/${tutor.id}`}
                  className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  View profile
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Tutors;