// In development the API defaults to a local learnhub-api on port 5000.
// A production build must set VITE_API_URL (e.g. https://api.example.com/api).
const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "");

export const SESSION_EXPIRED_EVENT = "learnhub:session-expired";

function getToken() {
  return localStorage.getItem("token");
}

export class ApiError extends Error {
  constructor(message, { status, code, fieldErrors } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors || null;
  }
}

async function request(endpoint, options = {}) {
  if (!BASE_URL) {
    throw new ApiError("The site isn't connected to the API. Set VITE_API_URL.", { status: 0 });
  }

  const token = getToken();

  // File uploads send FormData; the browser sets its multipart Content-Type.
  const isForm = options.body instanceof FormData;
  const headers = {
    ...(!isForm && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  let response;

  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError("Network error — check your connection.", {
      status: 0,
    });
  }

  if (response.status === 204) {
    return null;
  }

  const body = await response.json().catch(() => null);

  if (!body) {
    throw new ApiError(`Unexpected response (${response.status})`, {
      status: response.status,
    });
  }

  // A rejected token on anything but the login/register calls means the session
  // is over; AuthContext listens for this and signs the user out.
  if (response.status === 401 && token && !endpoint.startsWith("/auth/")) {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }

  if (!response.ok || body.success === false) {
    const message =
      body.message || fallbackMessageForStatus(response.status);

    throw new ApiError(message, {
      status: response.status,
      code: body.code,
      fieldErrors: body.errors,
    });
  }

  return body.data ?? body;
}

function fallbackMessageForStatus(status) {
  switch (status) {
    case 400:
      return "Invalid request.";
    case 401:
      return "You need to log in to continue.";
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return "Resource not found.";
    case 409:
      return "That already exists.";
    case 500:
      return "Something went wrong on our end. Please try again.";
    default:
      return "Request failed. Please try again.";
  }
}

export const apiClient = {
  get: (endpoint) =>
    request(endpoint, {
      method: "GET",
    }),

  post: (endpoint, body) =>
    request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (endpoint, body) =>
    request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: (endpoint, body) =>
    request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (endpoint) =>
    request(endpoint, {
      method: "DELETE",
    }),

  /** Sends one file as multipart form data in a "file" field. */
  upload: (endpoint, file) => {
    const body = new FormData();
    body.append("file", file);
    return request(endpoint, { method: "POST", body });
  },
};
