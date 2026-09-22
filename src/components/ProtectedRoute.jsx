import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RequireAuth({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function RequireTutor({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "tutor") {
    return <Navigate to="/courses" replace />;
  }

  return children;
}

export function GuestOnly({ children }) {
  const { user } = useAuth();

  if (user) {
    if (user.role === "tutor") {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/courses" replace />;
  }

  return children;
}