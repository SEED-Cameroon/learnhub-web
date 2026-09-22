const API_BASE_URL = import.meta.env.VITE_API_URL;

async function apiFetch(path, options = {}) {
  const token = sessionStorage.getItem("lh_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(
      data?.message || `API request failed: ${res.status} ${res.statusText}`
    );
  }

  return data;
}

export { API_BASE_URL, apiFetch };
