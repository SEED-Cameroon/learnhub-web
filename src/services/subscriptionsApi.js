// Tutor support/subscription API (Issues #33 + #37).
//
// The real lifecycle (per #37) is:
//   Student -> Select Tutor -> Enter Amount -> Select Provider -> Payment Request
//   -> Pending -> [provider sends webhook to YOUR BACKEND] -> Active / Failed
//   -> visible under My Subscriptions -> Cancel (record stays in history)
//
// IMPORTANT: the webhook step is inherently backend-only — MTN/Orange call a
// server endpoint you control, asynchronously, sometime after the payment
// prompt is approved/declined on the student's phone. Frontend code cannot
// receive that webhook. What's mocked below is a stand-in: `resolvePending()`
// simulates the delayed state change a real webhook would cause, so the rest
// of the app (My Subscriptions, cancellation, etc.) is fully buildable and
// testable now. Once the real backend exists, replace the mock block in each
// function with the real fetch() call already written in the `else` branch,
// and have your backend's webhook handler update the same subscription
// record your API returns from listSubscriptions().
const USE_MOCK_API = true;

const API_BASE_URL = "/api"; // TODO: point this at your real API origin once live

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const PROVIDERS = [
  { value: "mtn", label: "MTN Mobile Money", accent: "#FFCC08", textColor: "#12234F" },
  { value: "orange", label: "Orange Money", accent: "#FF7900", textColor: "#FFFFFF" },
];

export const SUPPORT_TIERS = [
  { amountFcfa: 2000, label: "Supporter", description: "Helps keep basic course materials free." },
  { amountFcfa: 5000, label: "Champion", description: "Funds new video equipment and advanced lessons.", popular: true },
];

// ---------------------------------------------------------------------------
// Mock in-memory subscription store. Cancelled subscriptions are never
// deleted — only their status changes — so they remain visible in history,
// per the #37 acceptance criteria.
// ---------------------------------------------------------------------------
let mockSubscriptions = [];
let mockNextId = 1;

function findSubscription(id) {
  return mockSubscriptions.find((s) => s.id === id);
}

// Idempotent by design: calling this twice with the same outcome is a no-op
// the second time, which is exactly what "duplicate webhook delivery doesn't
// corrupt state" requires — real payment providers do sometimes redeliver
// the same webhook, and a correct handler must tolerate that.
function resolveSubscriptionState(id, nextStatus) {
  const sub = findSubscription(id);
  if (!sub) return null;
  if (sub.status !== "pending") return sub; // already resolved — ignore duplicate/late webhook
  sub.status = nextStatus;
  sub.resolvedAt = new Date().toISOString();
  return sub;
}

// ---------------------------------------------------------------------------
// Create a subscription: writes a "pending" record immediately, then
// simulates the webhook-driven confirmation after a delay (mirrors real
// Mobile Money prompts, which take a few seconds to confirm on-device).
//
// TESTING THE FAILURE PATH (mock mode only): use a phone number ending in
// "0000" to simulate a declined payment / provider failure — mirrors how
// real payment sandboxes (Stripe, etc.) use magic test values.
// ---------------------------------------------------------------------------
export async function createSubscription({ tutorId, tutorName, amountFcfa, provider, phoneNumber, token }) {
  if (!token) throw new Error("You must be logged in to support a tutor.");
  if (!tutorId) throw new Error("Please select a tutor to support.");
  if (!amountFcfa || amountFcfa <= 0) throw new Error("Please enter a valid amount.");
  if (!provider) throw new Error("Please select a payment provider.");
  if (!phoneNumber) throw new Error("Please enter a mobile money number.");

  if (USE_MOCK_API) {
    const id = `mock-sub-${mockNextId++}`;
    const subscription = {
      id,
      tutorId,
      tutorName,
      amountFcfa,
      provider,
      phoneNumber,
      status: "pending",
      createdAt: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      cancelledAt: null,
      resolvedAt: null,
    };
    mockSubscriptions.unshift(subscription);

    await delay(1400); // simulates time for the student to approve the on-device prompt

    const isSimulatedProviderFailure = phoneNumber.replace(/\s+/g, "").endsWith("0000");
    const resolved = resolveSubscriptionState(id, isSimulatedProviderFailure ? "failed" : "active");

    return {
      status: resolved.status,
      subscriptionId: resolved.id,
      message:
        resolved.status === "failed"
          ? "The payment was declined by your mobile money provider. Please try again."
          : "Your support subscription is now active.",
    };
  }

  const res = await fetch(`${API_BASE_URL}/subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ tutorId, amountFcfa, provider, phoneNumber }),
  });
  if (!res.ok) throw new Error("Couldn't process your payment. Please try again.");
  return res.json(); // expected shape: { status: "success" | "failed", subscriptionId?, message }
  // Real backend note: this initial response typically only confirms the
  // request was accepted (still "pending") — the actual active/failed
  // transition happens later via the provider's webhook hitting your server,
  // which should update the same subscription record the frontend then
  // reads back via listSubscriptions().
}

// ---------------------------------------------------------------------------
// List the current student's subscriptions, for the My Subscriptions page.
// ---------------------------------------------------------------------------
export async function listSubscriptions({ token }) {
  if (!token) throw new Error("You must be logged in to view your subscriptions.");
  if (USE_MOCK_API) {
    await delay(500);
    return [...mockSubscriptions]; // mock: single dev user, so no filtering needed
  }
  const res = await fetch(`${API_BASE_URL}/subscriptions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Couldn't load your subscriptions. Please try again.");
  return res.json(); // expected shape: Subscription[]
}

// ---------------------------------------------------------------------------
// Cancel a subscription. The record is kept (status flips to "cancelled"),
// never deleted, so it remains visible in history.
// ---------------------------------------------------------------------------
export async function cancelSubscription({ subscriptionId, token }) {
  if (!token) throw new Error("You must be logged in to cancel a subscription.");
  if (USE_MOCK_API) {
    await delay(500);
    const sub = findSubscription(subscriptionId);
    if (!sub) throw new Error("Subscription not found.");
    if (sub.status === "cancelled") return { ...sub }; // idempotent — already cancelled
    sub.status = "cancelled";
    sub.cancelledAt = new Date().toISOString();
    return { ...sub };
  }
  const res = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Couldn't cancel this subscription. Please try again.");
  return res.json();
}