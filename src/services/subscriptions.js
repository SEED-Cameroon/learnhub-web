import { apiClient } from './apiClient'
import { USE_MOCKS, mockResponse } from './mock'
import { SUBSCRIPTIONS, TUTORS } from '@/data/mock'

export const PROVIDERS = [
  { value: 'mtn', label: 'MTN Mobile Money' },
  { value: 'orange', label: 'Orange Money' },
]

export const SUPPORT_AMOUNTS_XAF = [500, 1000, 2000, 5000]

// Cameroon mobile numbers: 9 digits starting with 6, without the +237 prefix.
export const PHONE_PATTERN = /^6\d{8}$/

const withTutor = (s) => ({ ...s, tutor: TUTORS.find((t) => t.id === s.tutorId) })

/**
 * POST /subscriptions — starts a Mobile Money payment request. The result is
 * always "pending": the provider confirms asynchronously via backend webhook.
 */
export function createSubscription({ tutorId, amountXaf, provider, phone }) {
  if (!USE_MOCKS) return apiClient.post('/subscriptions', { tutorId, amountXaf, provider, phone })
  const sub = {
    id: `sub${Date.now()}`,
    tutorId,
    amountXaf,
    provider,
    status: 'pending',
    startedAt: new Date().toISOString().slice(0, 10),
    nextBillingAt: null,
  }
  SUBSCRIPTIONS.unshift(sub)
  return mockResponse(withTutor(sub), 900)
}

/** GET /subscriptions/me */
export function listMySubscriptions() {
  if (!USE_MOCKS) return apiClient.get('/subscriptions/me')
  return mockResponse(SUBSCRIPTIONS.map(withTutor))
}

/** DELETE /subscriptions/:id — cancels billing; the record stays in history. */
export function cancelSubscription(id) {
  if (!USE_MOCKS) return apiClient.delete(`/subscriptions/${id}`)
  const sub = SUBSCRIPTIONS.find((s) => s.id === id)
  if (sub) {
    sub.status = 'cancelled'
    sub.nextBillingAt = null
  }
  return mockResponse(withTutor(sub))
}
