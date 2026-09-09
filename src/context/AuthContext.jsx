import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("lhc_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authApi.me();
        setUser(currentUser);
      } catch {
        localStorage.removeItem("lhc_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({
      email,
      password,
    });

    /*
     * The backend response is expected to contain the
     * authentication token.
     *
     * Your apiClient already returns body.data when
     * the backend response has a data property.
     */
    const token = response?.token;

    if (!token) {
      throw new Error(
        "Login succeeded, but no authentication token was returned."
      );
    }

    localStorage.setItem("lhc_token", token);

    /*
     * If the login response already contains the user,
     * use it. Otherwise, fetch the current user.
     */
    if (response?.user) {
      setUser(response.user);
      return response.user;
    }

    const currentUser = await authApi.me();

    setUser(currentUser);

    return currentUser;
  };

  const logout = () => {
    localStorage.removeItem("lhc_token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}