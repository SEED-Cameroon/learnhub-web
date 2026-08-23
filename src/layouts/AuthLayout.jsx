import { Link } from "react-router-dom";

export default function AuthLayout({ children, activePage }) {
  return (
    <main className="auth-page">
      <div className="auth-brand">
        <Link to="/login" className="brand-name">
          LearnHub<span>.</span>
        </Link>

        <p className="brand-tagline">
          Empowering learning, connecting people
        </p>
      </div>

      <div className="auth-card">
        <div className="auth-tabs">
          <Link
            to="/login"
            className={`auth-tab ${
              activePage === "login" ? "active" : ""
            }`}
          >
            Log in
          </Link>

          <Link
            to="/signup"
            className={`auth-tab ${
              activePage === "signup" ? "active" : ""
            }`}
          >
            Sign up
          </Link>
        </div>

        {children}
      </div>
    </main>
  );
}
