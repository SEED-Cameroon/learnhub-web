// Sample data is used until the API is configured. Set VITE_API_URL to
// switch every service over to the real backend.
export const USE_MOCKS = !import.meta.env.VITE_API_URL

export function mockResponse(value, ms = 350) {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms))
}

export class MockNotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message)
    this.status = 404
  }
}
