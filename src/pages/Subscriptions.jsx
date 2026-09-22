import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  const loadSubscriptions = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/subscriptions/me");

      const data =
        response?.data?.subscriptions ??
        response?.data ??
        response;

      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load your subscriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handleCancel = async (subscriptionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this subscription?"
    );

    if (!confirmed) {
      return;
    }

    setActionId(subscriptionId);
    setError("");

    try {
      await apiFetch(`/subscriptions/${subscriptionId}/cancel`, {
        method: "PATCH",
      });

      setSubscriptions((currentSubscriptions) =>
        currentSubscriptions.map((subscription) =>
          (subscription.id || subscription._id) === subscriptionId
            ? {
                ...subscription,
                status: "cancelled",
              }
            : subscription
        )
      );
    } catch (err) {
      setError(err.message || "Unable to cancel this subscription.");
    } finally {
      setActionId(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-50 text-green-700";

      case "pending":
        return "bg-yellow-50 text-yellow-700";

      case "failed":
        return "bg-red-50 text-red-700";

      case "cancelled":
      case "canceled":
        return "bg-slate-100 text-slate-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getTutorName = (subscription) =>
    subscription.tutor?.name ||
    subscription.tutorName ||
    subscription.tutor?.displayName ||
    "Tutor";

  const getAmount = (subscription) =>
    subscription.amount ?? subscription.price ?? 0;

  const getProvider = (subscription) =>
    subscription.provider
      ? subscription.provider.toUpperCase()
      : "Not specified";

  const getNextBilling = (subscription) =>
    subscription.nextBillingDate ||
    subscription.nextBilling ||
    subscription.currentPeriodEnd ||
    "Not available";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/account"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Back to account
        </Link>

        <section className="mt-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              My Account
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              My Subscriptions
            </h1>

            <p className="mt-3 text-slate-600">
              View your tutor subscriptions, payment status, and next billing
              information.
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

          {loading && (
            <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-24 rounded-lg bg-slate-200"
                  />
                ))}
              </div>
            </div>
          )}

          {!loading && !error && subscriptions.length === 0 && (
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                No subscriptions yet
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-slate-600">
                When you subscribe to a tutor, your active and pending
                subscriptions will appear here.
              </p>

              <Link
                to="/tutors"
                className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Browse tutors
              </Link>
            </div>
          )}

          {!loading && subscriptions.length > 0 && (
            <div className="mt-8 grid gap-5">
              {subscriptions.map((subscription) => {
                const subscriptionId =
                  subscription.id || subscription._id;

                const status = subscription.status || "unknown";
                const isActive = status.toLowerCase() === "active";
                const isPending = status.toLowerCase() === "pending";
                const isActing = actionId === subscriptionId;

                return (
                  <article
                    key={subscriptionId}
                    className="rounded-xl bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          Tutor
                        </p>

                        <h2 className="mt-1 text-xl font-semibold text-slate-900">
                          {getTutorName(subscription)}
                        </h2>

                        <div className="mt-4 grid gap-4 sm:grid-cols-3">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                              Amount
                            </p>

                            <p className="mt-1 font-semibold text-slate-900">
                              {getAmount(subscription)} FCFA
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                              Provider
                            </p>

                            <p className="mt-1 font-semibold text-slate-900">
                              {getProvider(subscription)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                              Next billing
                            </p>

                            <p className="mt-1 font-semibold text-slate-900">
                              {getNextBilling(subscription)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-3 lg:items-end">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>

                        {(isActive || isPending) && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCancel(subscriptionId)
                            }
                            disabled={isActing}
                            className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isActing
                              ? "Cancelling..."
                              : "Cancel subscription"}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Subscriptions;