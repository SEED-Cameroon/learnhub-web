import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";

function CreateCourse() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    thumbnailUrl: "",
    previewVideoUrl: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setError("");
  };

  const createCourse = async (status) => {
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
      const response = await apiFetch("/courses", {
        method: "POST",
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category.trim(),
          price: Number(form.price),
          thumbnailUrl: form.thumbnailUrl.trim() || undefined,
          previewVideoUrl: form.previewVideoUrl.trim() || undefined,
        }),
      });

      const createdCourse =
        response?.data?.course ??
        response?.course ??
        response?.data ??
        null;

      const courseId = createdCourse?.id || createdCourse?._id;

      if (!courseId) {
        throw new Error(
          "Course was created, but its ID could not be identified."
        );
      }

      if (status === "published") {
        await apiFetch(`/courses/${courseId}`, {
          method: "PATCH",
          body: JSON.stringify({
            status: "published",
          }),
        });
      }

      navigate("/dashboard/courses");
    } catch (err) {
      setError(err.message || "Unable to create the course.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createCourse("draft");
  };

  const handlePublish = async () => {
    await createCourse("published");
  };

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
              Create a course
            </h1>

            <p className="mt-3 text-slate-600">
              Add the course information below. You can save it as a draft or
              publish it immediately.
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
                placeholder="Enter your course title"
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
                placeholder="Describe what learners will learn."
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
                  placeholder="Mathematics"
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
                  placeholder="5000"
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

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save as draft"}
              </button>

              <button
                type="button"
                onClick={handlePublish}
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Publishing..." : "Create and publish"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default CreateCourse;