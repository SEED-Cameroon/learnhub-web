import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function SupportTutor() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid support amount.");
      return;
    }

    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const response = await apiFetch("/subscriptions", {
        method: "POST",
        body: JSON.stringify({
          tutorId: id,
          amount: Number(amount),
        }),
      });

      setMessage(
        response?.message ||
          "Your support request has been submitted successfully."
      );
      setAmount("");
    } catch (err) {
      setError(err.message || "Unable to submit your support request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-xl rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Support this tutor
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            You need to log in before you can support a tutor.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-xl">
        <Link
          to={`/tutors/${id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Back to tutor profile
        </Link>

        <section className="mt-6 rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Support this tutor
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            Choose an amount to support this tutor. Supporting a tutor does
            not restrict access to their courses.
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

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="amount"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Support amount
              </label>

              <input
                id="amount"
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Enter amount"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Continue"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default SupportTutor;