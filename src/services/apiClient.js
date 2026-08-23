const BASE_URL = import.meta.env.VITE_API_URL || "";

function getToken() {
  return localStorage.getItem("lhc_token");
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
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
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
};