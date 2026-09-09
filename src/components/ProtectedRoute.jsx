import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRole }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            LearnHub
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    if (user?.role === "tutor") {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;