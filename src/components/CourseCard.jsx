import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <article className="course-card">

      <img
        src={course.image}
        alt={course.title}
      />

      <div className="course-content">

        <span className="course-level">
          {course.level}
        </span>

        <h3>{course.title}</h3>

        <p>{course.description}</p>

        <div className="course-meta">
          <span>⏱ {course.duration}</span>
          <span>👥 {course.students}</span>
        </div>

        <Link
          to={`/courses/${course.id}`}
          className="course-btn"
        >
          View Course →
        </Link>

      </div>
    </article>
  );
}