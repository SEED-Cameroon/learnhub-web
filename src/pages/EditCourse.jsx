import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    thumbnailUrl: "",
    previewVideoUrl: "",
    status: "draft",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiFetch(`/courses/${id}`);

        const course =
          response?.data?.course ??
          response?.course ??
          response?.data ??
          null;

        if (!course) {
          throw new Error("Course not found.");
        }

        setForm({
          title: course.title || "",
          description: course.description || "",
          category: course.category || "",
          price: course.price ?? "",
          thumbnailUrl: course.thumbnailUrl || "",
          previewVideoUrl: course.previewVideoUrl || "",
          status:
            course.status === "published"
              ? "published"
              : "draft",
        });
      } catch (err) {
        setError(err.message || "Unable to load this course.");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Course title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Course description is required.");
      return;
    }

    if (!form.category.trim()) {
      setError("Course category is required.");
      return;
    }

    if (form.price === "" || Number(form.price) < 0) {
      setError("Please enter a valid course price.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await apiFetch(`/courses/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category.trim(),
          price: Number(form.price),
          thumbnailUrl: form.thumbnailUrl.trim() || undefined,
          previewVideoUrl: form.previewVideoUrl.trim() || undefined,
          status: form.status,
        }),
      });

      navigate("/dashboard/courses");
    } catch (err) {
      setError(err.message || "Unable to update this course.");
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
          <div className="mt-5 h-32 rounded bg-slate-200" />
          <div className="mt-5 h-12 rounded bg-slate-200" />
        </div>
      </main>
    );
  }

  if (error && !form.title) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-bold text-red-800">
            Unable to load course
          </h1>

          <p className="mt-2 text-red-700">{error}</p>

          <button
            type="button"
            onClick={() => navigate("/dashboard/courses")}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to my courses
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate("/dashboard/courses")}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Back to my courses
        </button>

        <section className="mt-6 rounded-xl bg-white p-8 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Tutor Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Edit course
            </h1>

            <p className="mt-3 text-slate-600">
              Update your course information and publishing status.
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

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Course title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows="6"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Price (FCFA)
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="thumbnailUrl"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Thumbnail URL
              </label>

              <input
                id="thumbnailUrl"
                name="thumbnailUrl"
                type="url"
                value={form.thumbnailUrl}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="https://example.com/course-image.jpg"
              />
            </div>

            <div>
              <label
                htmlFor="previewVideoUrl"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Preview video URL
              </label>

              <input
                id="previewVideoUrl"
                name="previewVideoUrl"
                type="url"
                value={form.previewVideoUrl}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Course status
              </label>

              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default EditCourse;