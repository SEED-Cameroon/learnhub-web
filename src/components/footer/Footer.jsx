import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h1>LearnHub Cameroon</h1>

        <p>
          © 2024 LearnHub Cameroon. Empowering local
          <br />
          tutors and students.
        </p>
      </div>

      <div className="footer-links">
        <a href="#courses">Courses</a>
        <a href="#tutors">Tutors</a>
        <a href="#support">Support</a>
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms of Service</a>
      </div>
    </footer>
  );
};

export default Footer;