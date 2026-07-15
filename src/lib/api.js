const API_BASE_URL = import.meta.env.VITE_API_URL

/**
 * Small fetch wrapper for calling the LearnHub API.
 * @param {string} path - endpoint path, e.g. "/courses"
 * @param {RequestInit} [options] - standard fetch options
 * @returns {Promise<any>} parsed JSON response
 */
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export { API_BASE_URL, apiFetch }
