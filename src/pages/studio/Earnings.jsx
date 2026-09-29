import { Link } from "react-router-dom";

function Earnings() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/dashboard"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Back to dashboard
        </Link>

        <section className="mt-6 rounded-xl bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Tutor Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Earnings & Payouts
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Track your tutor earnings, subscriber activity, and payout history
            from one place.
          </p>

          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-8">
            <h2 className="text-xl font-semibold text-slate-900">
              Earnings are coming soon
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              The earnings and payout backend is part of the Phase 2 API.
              This section is ready for the live earnings data once those
              endpoints are available.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              <article className="rounded-lg bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  This month
                </p>

                <p className="mt-3 text-2xl font-bold text-slate-900">
                  Not available
                </p>
              </article>

              <article className="rounded-lg bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Last month
                </p>

                <p className="mt-3 text-2xl font-bold text-slate-900">
                  Not available
                </p>
              </article>

              <article className="rounded-lg bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Active subscribers
                </p>

                <p className="mt-3 text-2xl font-bold text-slate-900">
                  Not available
                </p>
              </article>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Payout history
            </h2>

            <p className="mt-2 text-slate-600">
              Your completed and pending payouts will appear here when the
              payout API is available.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Earnings;