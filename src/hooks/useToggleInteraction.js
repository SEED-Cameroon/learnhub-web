import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

// Generic auth-gated "toggle" hook — powers both course-like and tutor-follow,
// since they're the same interaction shape: fetch initial status, then
// optimistically toggle on/off with duplicate-click protection and rollback
// on error.
//
// getStatus({ id, initialCount })              -> { count, active }
// onAction({ id, initialCount, token })         -> { count, active }
// offAction({ id, initialCount, token })        -> { count, active }
export function useToggleInteraction({ id, initialCount, getStatus, onAction, offAction, countKey, activeKey }) {
  const { isAuthenticated, token } = useAuth();

  const [count, setCount] = useState(initialCount);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getStatus({ id, initialCount })
      .then((result) => {
        if (cancelled) return;
        setCount(result[countKey]);
        setActive(result[activeKey]);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Couldn't load status.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggle = async () => {
    if (!isAuthenticated) {
      setError("Log in to continue.");
      return;
    }
    if (pending) return; // blocks duplicate rapid clicks

    setPending(true);
    setError(null);

    const wasActive = active;
    const previousCount = count;

    // optimistic update
    setActive(!wasActive);
    setCount((c) => c + (wasActive ? -1 : 1));

    try {
      const action = wasActive ? offAction : onAction;
      const result = await action({ id, initialCount, token });
      setCount(result[countKey]);
      setActive(result[activeKey]);
    } catch (err) {
      // rollback on failure
      setActive(wasActive);
      setCount(previousCount);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return { count, active, loading, pending, error, toggle };
}