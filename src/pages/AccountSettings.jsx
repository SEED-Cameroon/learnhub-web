import { useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function AccountSettings() {
  const { user, login } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await apiFetch("/me", {
        method: "PATCH",
        body: JSON.stringify({
          name,
          email,
        }),
      });

      const data = response?.data ?? response;
      const updatedUser = data?.user ?? data;

      if (updatedUser && typeof updatedUser === "object") {
        login(updatedUser);
      }

      setMessage(response?.message || "Your account has been updated.");
    } catch (err) {
      setError(err.message || "Unable to update your account.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/account"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Back to account
        </Link>

        <section className="mt-6 rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Account settings
          </h1>

          <p className="mt-2 text-slate-600">
            Update your LearnHub account information.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {message && (
            <div
              role="status"
              className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Account type
              </label>

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm capitalize text-slate-600">
                {user?.role || "student"}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default AccountSettings;