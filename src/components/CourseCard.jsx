import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <article className="course-card">

      <Link to={`/courses/${course.id}`} className="course-image-wrapper">
        <img
          src={course.image}
          alt={course.title}
          className="course-image"
        />

        <span className="course-level">
          {course.level}
        </span>
      </Link>

      <div className="course-card-content">

        <span className="course-category">
          {course.category}
        </span>

        <Link to={`/courses/${course.id}`}>
          <h3>{course.title}</h3>
        </Link>

        <div className="tutor-mini">

          <img
            src={course.tutor.avatar}
            alt={course.tutor.name}
          />

          <div>
            <strong>{course.tutor.name}</strong>
            <span>{course.tutor.role}</span>
          </div>

        </div>

        <div className="course-meta">
          <span>★ {course.rating}</span>
          <span>{course.lessons} lessons</span>
          <span>{course.duration}</span>
        </div>

        <div className="course-bottom">
          <strong>{course.price}</strong>

          <Link
            to={`/courses/${course.id}`}
            className="view-course"
          >
            View Course
          </Link>
        </div>

      </div>

    </article>
  );
}