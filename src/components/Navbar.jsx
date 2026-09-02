import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Learn<span>Hub</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/tutors" className="active">
          Tutors
        </Link>
        <Link to="/about">About</Link>
      </div>

      <div className="nav-actions">
        <button className="login-btn">Log in</button>
        <button className="signup-btn">Get Started</button>
      </div>
    </nav>
  );
}