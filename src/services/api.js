import { apiClient } from "./apiClient";
import { toUser } from "./normalize";

async function login({ email, password }) {
  const { user, token } = await apiClient.post("/auth/login", { email, password });
  return { user: toUser(user), token };
}

export const authApi = {
  /** POST /auth/register returns no token, so a successful sign-up logs straight in. */
  register: async (payload) => {
    await apiClient.post("/auth/register", payload);
    return login(payload);
  },

  /** POST /auth/login → { user, token } */
  login,

  me: async () => {
    const { user } = await apiClient.get("/me");
    return toUser(user);
  },
};
