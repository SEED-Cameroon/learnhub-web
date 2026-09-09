// Tutor support/subscription API (Issue #33).
// Same pattern as the other services: USE_MOCK_API=true simulates the backend
// so the whole flow is testable now. Flip to false once the real endpoint
// exists — the request/response shape below matches what the backend spec
// describes: tutor, amount, provider, and phone number required.
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
// Creates a support subscription.
//
// TESTING THE FAILURE PATH (mock mode only): use a phone number ending in
// "0000" to simulate a declined/failed payment — mirrors how real payment
// sandboxes (Stripe, etc.) use magic test values. Any other valid number
// simulates success.
// ---------------------------------------------------------------------------
export async function createSubscription({ tutorId, amountFcfa, provider, phoneNumber, token }) {
  if (!token) throw new Error("You must be logged in to support a tutor.");
  if (!tutorId) throw new Error("Please select a tutor to support.");
  if (!amountFcfa || amountFcfa <= 0) throw new Error("Please enter a valid amount.");
  if (!provider) throw new Error("Please select a payment provider.");
  if (!phoneNumber) throw new Error("Please enter a mobile money number.");

  if (USE_MOCK_API) {
    await delay(1400); // real Mobile Money prompts take a few seconds to confirm on-device

    const isSimulatedFailure = phoneNumber.replace(/\s+/g, "").endsWith("0000");
    if (isSimulatedFailure) {
      return {
        status: "failed",
        message: "The payment was declined by your mobile money provider. Please try again.",
      };
    }

    return {
      status: "success",
      subscriptionId: `mock-sub-${Date.now()}`,
      message: "Your support subscription is now active.",
    };
  }

  const res = await fetch(`${API_BASE_URL}/subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ tutorId, amountFcfa, provider, phoneNumber }),
  });
  if (!res.ok) throw new Error("Couldn't process your payment. Please try again.");
  return res.json(); // expected shape: { status: "success" | "failed", subscriptionId?, message }
}