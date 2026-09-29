import { Link } from "react-router-dom";

export default function TutorCard({ tutor }) {
  return (
    <article className="tutor-card">

      <div className="tutor-image-container">
        <img
          src={tutor.avatar}
          alt={tutor.name}
          className="tutor-image"
        />

        <span className="verified">
          ✓ Verified
        </span>
      </div>

      <div className="tutor-card-content">

        <div className="rating">
          ⭐ {tutor.rating}
        </div>

        <h3>{tutor.name}</h3>

        <p className="tutor-role">
          {tutor.role}
        </p>

        <span className="subject-tag">
          {tutor.subject}
        </span>

        <div className="tutor-stats">
          <span>👨‍🎓 {tutor.students} students</span>
          <span>📚 {tutor.courses} courses</span>
        </div>

        <Link
          to={`/tutors/${tutor.id}`}
          className="profile-btn"
        >
          View Profile →
        </Link>

      </div>
    </article>
  );
}