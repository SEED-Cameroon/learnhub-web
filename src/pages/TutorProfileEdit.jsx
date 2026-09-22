import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function TutorProfileEdit() {
  const { user, login } = useAuth();

  const tutorId = user?.id || user?._id;

  const [form, setForm] = useState({
    name: "",
    avatarUrl: "",
    bio: "",
    subjectTags: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!tutorId) {
        setError("Your tutor account could not be identified.");
        setLoading(false);
        return;
      }

      try {
        const response = await apiFetch(`/tutors/${tutorId}`);

        const tutor =
          response?.data?.tutor ??
          response?.tutor ??
          null;

        if (!tutor) {
          throw new Error("Unable to load your tutor profile.");
        }

        setForm({
          name: tutor.name || "",
          avatarUrl: tutor.avatarUrl || "",
          bio: tutor.bio || "",
          subjectTags: Array.isArray(tutor.subjectTags)
            ? tutor.subjectTags.join(", ")
            : tutor.subjectTags || "",
        });
      } catch (err) {
        setError(
          err.message || "Unable to load your tutor profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [tutorId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!tutorId) {
      setError("Your tutor account could not be identified.");
      return;
    }

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const subjectTags = form.subjectTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      const response = await apiFetch(`/tutors/${tutorId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: form.name.trim(),
          avatarUrl: form.avatarUrl.trim(),
          bio: form.bio.trim(),
          subjectTags,
        }),
      });

      const updatedTutor =
        response?.data?.tutor ??
        response?.tutor ??
        null;

      if (updatedTutor) {
        const updatedUser = {
          ...user,
          ...updatedTutor,
        };

        login(updatedUser);
      }

      setSuccess("Your tutor profile has been updated successfully.");
    } catch (err) {
      setError(
        err.message || "Unable to update your tutor profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-3xl animate-pulse rounded-xl bg-white p-8 shadow-sm">
          <div className="h-8 w-1/2 rounded bg-slate-200" />
          <div className="mt-8 h-12 rounded bg-slate-200" />
          <div className="mt-5 h-12 rounded bg-slate-200" />
          <div className="mt-5 h-32 rounded bg-slate-200" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/dashboard"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Back to dashboard
        </Link>

        <section className="mt-6 rounded-xl bg-white p-8 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Tutor Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Edit tutor profile
            </h1>

            <p className="mt-3 text-slate-600">
              Update the information learners see on your public tutor
              profile.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="avatarUrl"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Avatar URL
              </label>

              <input
                id="avatarUrl"
                name="avatarUrl"
                type="url"
                value={form.avatarUrl}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="https://example.com/avatar.jpg"
              />

              <p className="mt-2 text-xs text-slate-500">
                Provide a publicly accessible image URL.
              </p>
            </div>

            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Bio
              </label>

              <textarea
                id="bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows="6"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="Tell learners about your teaching experience and subjects."
              />
            </div>

            <div>
              <label
                htmlFor="subjectTags"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Subject tags
              </label>

              <input
                id="subjectTags"
                name="subjectTags"
                type="text"
                value={form.subjectTags}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="Mathematics, Physics, Computer Science"
              />

              <p className="mt-2 text-xs text-slate-500">
                Separate multiple subjects with commas.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>

              <Link
                to={`/tutors/${tutorId}`}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
              >
                View public profile
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default TutorProfileEdit;