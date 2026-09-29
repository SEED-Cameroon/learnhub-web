import { apiClient } from './apiClient'
import { toSubscription } from './normalize'

export const PROVIDERS = [
  { value: 'mtn', label: 'MTN Mobile Money' },
  { value: 'orange', label: 'Orange Money' },
]

export const SUPPORT_AMOUNTS_XAF = [500, 1000, 2000, 5000]

// Cameroon mobile numbers: 9 digits starting with 6, without the +237 prefix.
export const PHONE_PATTERN = /^6\d{8}$/

/**
 * POST /subscriptions — starts a Mobile Money payment request. The result is
 * always "pending": the provider confirms asynchronously via backend webhook.
 */
export async function createSubscription({ tutorId, amountXaf, provider, phone }) {
  const { subscription } = await apiClient.post('/subscriptions', {
    tutorId,
    amount: amountXaf,
    provider,
    phoneNumber: `+237${phone}`,
  })
  return toSubscription(subscription)
}

/** GET /subscriptions/:id — used to follow a payment until it is confirmed. */
export async function getSubscription(id) {
  const { subscription } = await apiClient.get(`/subscriptions/${id}`)
  return toSubscription(subscription)
}

/** GET /subscriptions/me */
export async function listMySubscriptions() {
  const { subscriptions } = await apiClient.get('/subscriptions/me')
  return subscriptions.map(toSubscription)
}

/** PATCH /subscriptions/:id/cancel — cancels billing; the record stays in history. */
export async function cancelSubscription(id) {
  const { subscription } = await apiClient.patch(`/subscriptions/${id}/cancel`)
  return toSubscription(subscription)
}
