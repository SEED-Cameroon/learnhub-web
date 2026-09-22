import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      label: "Subscribers",
      value: user?.subscriberCount ?? user?.subscribersCount ?? 0,
    },
    {
      label: "Total earnings",
      value: user?.earnings ?? "Not available",
    },
    {
      label: "Course views",
      value: user?.views ?? user?.totalViews ?? 0,
    },
    {
      label: "Rating",
      value: user?.rating ?? "Not available",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Tutor Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, {user?.name || "Tutor"}
            </h1>

            <p className="mt-2 text-slate-600">
              Manage your courses, audience, earnings, and tutor activity.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard/profile"
              className="inline-flex rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600"
            >
              Edit profile
            </Link>

            <Link
              to="/dashboard/courses/new"
              className="inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create course
            </Link>
          </div>
        </div>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">
                {stat.label}
              </p>

              <p className="mt-3 text-2xl font-bold text-slate-900">
                {stat.value}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <Link
            to="/dashboard/courses"
            className="rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              My Courses
            </h2>

            <p className="mt-2 leading-6 text-slate-600">
              Create, edit, publish, unpublish, and delete your courses.
            </p>

            <span className="mt-5 inline-flex text-sm font-semibold text-blue-600">
              Manage courses
            </span>
          </Link>

          <Link
            to="/dashboard/earnings"
            className="rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-slate-900">
              Earnings & Payouts
            </h2>

            <p className="mt-2 leading-6 text-slate-600">
              View earnings, subscriber activity, and payout information.
            </p>

            <span className="mt-5 inline-flex text-sm font-semibold text-blue-600">
              View earnings
            </span>
          </Link>

          <Link
            to="/dashboard/profile"
            className="rounded-xl bg-slate-900 p-6 text-white transition hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold">
              Tutor Profile
            </h2>

            <p className="mt-2 leading-6 text-slate-300">
              Update the information learners see on your public tutor
              profile.
            </p>

            <span className="mt-5 inline-flex text-sm font-semibold text-white">
              Edit profile
            </span>
          </Link>
        </section>

        <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Recent activity
          </h2>

          <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-6">
            <p className="text-slate-600">
              Your recent tutor activity will appear here as learners
              interact with your courses and profile.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;