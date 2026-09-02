import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import CourseCard from "../components/CourseCard";
import { tutors } from "../data/tutors";

export default function TutorProfile() {

  const { id } = useParams();

  const tutor = tutors.find(
    (item) => item.id === id
  );

  const [following, setFollowing] = useState(false);

  // Invalid tutor ID
  if (!tutor) {
    return (
      <>
        <Navbar />

        <div className="not-found">

          <div className="not-found-number">
            404
          </div>

          <h1>Tutor not found</h1>

          <p>
            The tutor you're looking for doesn't exist
            or may have been removed.
          </p>

          <Link to="/tutors">
            ← Back to Tutors
          </Link>

        </div>
      </>
    );
  }

  return (
    <div className="page">

      <Navbar />

      <main>

        {/* PROFILE HEADER */}

        <section className="profile-header">

          <div className="profile-cover"></div>

          <div className="profile-main">

            <img
              src={tutor.avatar}
              alt={tutor.name}
              className="profile-avatar"
            />

            <div className="profile-info">

              <div className="profile-name">

                <h1>{tutor.name}</h1>

                <span className="verified-badge">
                  ✓ Verified
                </span>

              </div>

              <p>{tutor.role}</p>

              <div className="profile-rating">
                ⭐ {tutor.rating} rating
                <span>•</span>
                {tutor.students} students
                <span>•</span>
                {tutor.courses} courses
              </div>

            </div>

            <button
              className={
                following
                  ? "follow-btn following"
                  : "follow-btn"
              }
              onClick={() =>
                setFollowing(!following)
              }
            >
              {following ? "✓ Following" : "+ Follow"}
            </button>

          </div>

        </section>


        {/* PROFILE CONTENT */}

        <section className="profile-content">

          <div className="profile-left">

            <div className="about-card">

              <span className="section-label">
                ABOUT THE TUTOR
              </span>

              <h2>About {tutor.name}</h2>

              <p>
                {tutor.bio}
              </p>

            </div>


            {/* COURSES */}

            <div className="published-courses">

              <div className="courses-heading">

                <div>

                  <span className="section-label">
                    LEARN WITH {tutor.name.split(" ")[0].toUpperCase()}
                  </span>

                  <h2>
                    Published courses
                  </h2>

                </div>

                <span>
                  {tutor.coursesList.length} courses
                </span>

              </div>

              <div className="course-grid">

                {tutor.coursesList.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                  />
                ))}

              </div>

            </div>

          </div>


          {/* SIDEBAR */}

          <aside className="profile-sidebar">

            <div className="stats-card">

              <h3>Tutor statistics</h3>

              <div className="stat">

                <strong>
                  {tutor.experience}
                </strong>

                <span>Teaching experience</span>

              </div>

              <div className="stat">

                <strong>
                  {tutor.students}+
                </strong>

                <span>Students taught</span>

              </div>

              <div className="stat">

                <strong>
                  {tutor.rating}/5
                </strong>

                <span>Average rating</span>

              </div>

            </div>

            <Link
              to="/tutors"
              className="back-btn"
            >
              ← Browse all tutors
            </Link>

          </aside>

        </section>

      </main>

    </div>
  );
}