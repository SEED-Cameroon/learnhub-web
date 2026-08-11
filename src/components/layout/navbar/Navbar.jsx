import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="logo">
        LearnHub Cameroon
      </div>

      {/* Navigation links */}
      <div className="nav-links">
        <a href="#courses">Courses</a>
        <a href="#tutors">Tutors</a>
        <a href="#about">About</a>
      </div>

      {/* Right side */}
      <div className="nav-actions">
        <a href="#" className="login">
          Login
        </a>

        <a href="#" className="signup">
          Sign Up
        </a>
      </div>

    </nav>
  );
}

export default Navbar;