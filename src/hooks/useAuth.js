import { useAuth as useAuthContext } from "@/context/AuthContext";

// Adapter so the course/subscription pages share the real AuthContext
// session. They expect { isAuthenticated, user, token }.
export function useAuth() {
  const { isAuthenticated, user } = useAuthContext();
  const token = isAuthenticated ? localStorage.getItem("token") : null;
  return { isAuthenticated, user, token };
}
