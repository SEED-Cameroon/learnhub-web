import { apiClient } from "./apiClient";
import { USE_MOCKS, mockResponse } from "./mock";
import { toUser } from "./normalize";

// Sample sign-in while VITE_API_URL is unset: any email and password work,
// and an email containing "tutor" signs in as a tutor.
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

async function login({ email, password }) {
  const { user, token } = await apiClient.post("/auth/login", { email, password });
  return { user: toUser(user), token };
}

export const authApi = {
  /** POST /auth/register returns no token, so a successful sign-up logs straight in. */
  register: async (payload) => {
    if (USE_MOCKS) return mockSession(payload);
    await apiClient.post("/auth/register", payload);
    return login(payload);
  },

  /** POST /auth/login → { user, token } */
  login: (payload) => (USE_MOCKS ? mockSession(payload) : login(payload)),

  me: async () => {
    const { user } = await apiClient.get("/me");
    return toUser(user);
  },
};
