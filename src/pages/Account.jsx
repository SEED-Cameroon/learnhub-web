import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Account() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                My Account
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                {user?.name || "Your account"}
              </h1>

              <p className="mt-2 text-slate-600">
                {user?.email || "No email available"}
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-red-500 hover:text-red-600"
            >
              Log out
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-6 sm:grid-cols-2">
          <Link
            to="/account/settings"
            className="rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              Account settings
            </h2>

            <p className="mt-2 leading-6 text-slate-600">
              Update your account information and preferences.
            </p>

            <span className="mt-5 inline-flex text-sm font-semibold text-blue-600">
              Manage settings
            </span>
          </Link>

          <Link
            to="/account/subscriptions"
            className="rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              My subscriptions
            </h2>

            <p className="mt-2 leading-6 text-slate-600">
              View your tutor subscriptions and their current status.
            </p>

            <span className="mt-5 inline-flex text-sm font-semibold text-blue-600">
              View subscriptions
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Account;