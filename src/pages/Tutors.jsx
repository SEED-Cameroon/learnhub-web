import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient, ApiError } from "../services/apiClient";

function Tutors() {
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTutors = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get("/tutors");
      setTutors(Array.isArray(response?.tutors) ? response.tutors : []);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Unable to load tutors. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutors();
  }, []);

  const filteredTutors = tutors.filter((tutor) => {
    const tutorName = tutor.name || tutor.fullName || "";
    const tutorSubject = tutor.subject || tutor.category || "";

    const matchesSearch = tutorName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesSubject =
      !subject ||
      tutorSubject.toLowerCase() === subject.toLowerCase();

    return matchesSearch && matchesSubject;
  });

  const subjects = [
    ...new Set(
      tutors
        .map((tutor) => tutor.subject || tutor.category)
        .filter(Boolean)
    ),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              LearnHub Tutors
            </p>

            <h1 className="mt-3 text-4xl font-extrabold text-slate-900 md:text-5xl">
              Learn from tutors who can help you grow
            </h1>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Discover tutors, explore their subjects, and find courses that
              match your learning goals.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_220px]">
            <div>
              <label
                htmlFor="tutor-search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Search tutors
              </label>

              <input
                id="tutor-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by tutor name"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="subject-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Subject
              </label>

              <select
                id="subject-filter"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All subjects</option>

                {subjects.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-16 w-16 rounded-full bg-slate-200" />
                <div className="mt-5 h-5 w-40 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-24 rounded bg-slate-200" />
                <div className="mt-5 h-4 w-full rounded bg-slate-200" />
                <div className="mt-2 h-4 w-4/5 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-bold text-red-800">
              Unable to load tutors
            </h2>

            <p className="mt-2 text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={loadTutors}
              className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredTutors.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              No tutors found
            </h2>

            <p className="mt-2 text-slate-600">
              Try changing your search or subject filter.
            </p>
          </div>
        )}

        {!loading && !error && filteredTutors.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTutors.map((tutor) => {
              const tutorName =
                tutor.name || tutor.fullName || "LearnHub Tutor";

              const tutorSubject =
                tutor.subject || tutor.category || "General Education";

              const tutorBio =
                tutor.bio || "Explore this tutor's courses on LearnHub.";

              const tutorId = tutor.id || tutor._id;

              return (
                <article
                  key={tutorId || tutorName}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-extrabold text-blue-700">
                      {tutorName.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-xl font-bold text-slate-900">
                        {tutorName}
                      </h2>

                      <p className="mt-1 text-sm font-semibold text-blue-600">
                        {tutorSubject}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
                    {tutorBio}
                  </p>

                  {tutorId ? (
                    <Link
                      to={`/tutors/${tutorId}`}
                      className="mt-6 block w-full rounded-xl border border-blue-600 px-4 py-3 text-center text-sm font-bold text-blue-600 transition hover:bg-blue-50"
                    >
                      View Tutor
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-6 w-full cursor-not-allowed rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-400"
                    >
                      View Tutor
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Tutors;