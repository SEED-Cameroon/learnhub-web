import { apiClient } from "./apiClient";

export const api = {
  get: (endpoint) => apiClient.get(endpoint),

  post: (endpoint, body) => apiClient.post(endpoint, body),

  put: (endpoint, body) => apiClient.put(endpoint, body),

  patch: (endpoint, body) => apiClient.patch(endpoint, body),

  delete: (endpoint) => apiClient.delete(endpoint),
};