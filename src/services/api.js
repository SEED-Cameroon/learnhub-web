import { apiClient } from "./apiClient";
import { USE_MOCKS, mockResponse } from "./mock";

// Sample sign-in while VITE_API_URL is unset: any password of 8+ characters
// works, and an email containing "tutor" signs in as a tutor.
function mockSession({ email, name, role }) {
  const isTutor = role ? role === "tutor" : /tutor/i.test(email);
  const user = {
    id: isTutor ? "t1" : "s1",
    name: name || (isTutor ? "Dr. Emmanuel Foning" : "Awa Ndzi"),
    email,
    role: isTutor ? "tutor" : "student",
  };
  return mockResponse({ user, token: `mock-${user.id}` }, 500);
}

export const authApi = {
  register: (payload) =>
    USE_MOCKS ? mockSession(payload) : apiClient.post("/auth/register", payload),

  login: (payload) =>
    USE_MOCKS ? mockSession(payload) : apiClient.post("/auth/login", payload),

  me: () => apiClient.get("/me"),
};
