import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Loader2, X } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useAuth } from "../hooks/useAuth";
import { listSubscriptions, cancelSubscription } from "../services/subscriptionsApi";

const STATUS_STYLES = {
  active: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-600",
  cancelled: "bg-slate-100 text-slate-500",
};

const STATUS_LABEL = {
  active: "Active",
  pending: "Pending",
  failed: "Payment Failed",
  cancelled: "Cancelled",
};

export default function MySubscriptions() {
  const { isAuthenticated, token } = useAuth();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await listSubscriptions({ token });
      setSubscriptions(result);
    } catch (err) {
      setError(err.message || "Couldn't load your subscriptions.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancel = async (subscriptionId) => {
    setCancellingId(subscriptionId);
    setError(null);
    try {
      const updated = await cancelSubscription({ subscriptionId, token });
      setSubscriptions((prev) => prev.map((s) => (s.id === subscriptionId ? updated : s)));
    } catch (err) {
      setError(err.message || "Couldn't cancel this subscription. Please try again.");
    } finally {
      setCancellingId(null);
      setConfirmCancelId(null);
    }
  };

  const activeSubs = subscriptions.filter((s) => s.status === "active");
  const monthlySpend = activeSubs.reduce((sum, s) => sum + s.amountFcfa, 0);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header activePage="courses" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">My Subscriptions</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your recurring payments and supported tutors.</p>

        {!isAuthenticated ? (
          <p className="mt-6 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-500">
            <Link to="/login" className="font-medium text-[#12234F] hover:underline">
              Log in
            </Link>{" "}
            to view your subscriptions.
          </p>
        ) : (
          <>
            {/* Summary cards */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Active Subscriptions</p>
                <p className="mt-1 text-2xl font-bold text-[#12234F]">{activeSubs.length}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Monthly Spend</p>
                <p className="mt-1 text-2xl font-bold text-[#12234F]">
                  {monthlySpend.toLocaleString()} <span className="text-sm font-normal text-slate-500">CFA</span>
                </p>
              </div>
              <div className="flex flex-col justify-between rounded-lg bg-[#12234F]/5 p-4">
                <p className="text-xs text-slate-600">Discover more tutors to support.</p>
                <Link
                  to="/courses"
                  className="mt-2 inline-block rounded-full bg-[#F0A93B] px-3 py-1.5 text-center text-xs font-semibold text-white hover:bg-[#D9931E]"
                >
                  Explore Tutors
                </Link>
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-4 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </p>
            )}

            {/* Subscription list */}
            <div className="mt-6 divide-y divide-slate-200 rounded-lg border border-slate-200">
              {loading && (
                <div className="flex items-center gap-2 px-4 py-6 text-sm text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading your subscriptions...
                </div>
              )}

              {!loading && subscriptions.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-slate-400">
                  You haven't supported any tutors yet.{" "}
                  <Link to="/courses" className="font-medium text-[#12234F] hover:underline">
                    Browse courses
                  </Link>{" "}
                  to find one.
                </div>
              )}

              {!loading &&
                subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{sub.tutorName || sub.tutorId}</p>
                      <p className="text-xs text-slate-500">
                        {sub.amountFcfa.toLocaleString()} CFA/mo ·{" "}
                        {sub.status === "cancelled"
                          ? `Cancelled ${new Date(sub.cancelledAt).toLocaleDateString()}`
                          : sub.status === "active"
                          ? `Next billing ${new Date(sub.nextBillingDate).toLocaleDateString()}`
                          : sub.status === "pending"
                          ? "Awaiting confirmation"
                          : "Payment declined"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={
                          "rounded-full px-2.5 py-1 text-[11px] font-medium " +
                          (STATUS_STYLES[sub.status] || "bg-slate-100 text-slate-500")
                        }
                      >
                        {STATUS_LABEL[sub.status] || sub.status}
                      </span>

                      {sub.status === "active" && (
                        <button
                          type="button"
                          onClick={() => setConfirmCancelId(sub.id)}
                          className="text-xs font-medium text-slate-500 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12234F] rounded"
                        >
                          Cancel
                        </button>
                      )}
                      {sub.status === "failed" && (
                        <Link
                          to={`/tutors/${sub.tutorId}/support`}
                          className="text-xs font-medium text-[#12234F] hover:underline"
                        >
                          Update Payment
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </main>

      <Footer />

      {confirmCancelId && (
        <CancelConfirmModal
          pending={cancellingId === confirmCancelId}
          onCancel={() => setConfirmCancelId(null)}
          onConfirm={() => handleCancel(confirmCancelId)}
        />
      )}
    </div>
  );
}

function CancelConfirmModal({ pending, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Cancel this subscription?</h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12234F] rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          You'll stop being charged going forward. This won't affect your access to any course content.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="flex-1 rounded-md border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#12234F]"
          >
            Keep Subscription
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}