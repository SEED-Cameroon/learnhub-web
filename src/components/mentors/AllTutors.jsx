import "./Mentors.css";
import "./AllTutors.css";

export default function AllTutors() {
  return (
    <section className="mentors-section">

      <div className="mentors-container">

        <h1 className="mentors-title">
          All Tutors
        </h1>

        <p className="all-tutors-description">
          Explore more tutors and find the right mentor for your learning journey.
        </p>

        <div className="mentor-grid">

          {/* Tutor 1 */}
          <div className="mentor-card">

            <div className="card-top blue"></div>

            <div className="profile-image">
              <img
                src="https://randomuser.me/api/portraits/men/52.jpg"
                alt="Mr. Emmanuel"
              />
            </div>

            <div className="card-content">

              <h3>
                Mr. Emmanuel
                <span className="verified">✓</span>
              </h3>

              <p className="subject">
                Physics
              </p>

              <p className="followers">
                ♟ &nbsp; 10k Followers
              </p>

              <button className="follow-button">
                Follow
              </button>

            </div>

          </div>


          {/* Tutor 2 */}
          <div className="mentor-card">

            <div className="card-top light-blue"></div>

            <div className="profile-image">
              <img
                src="https://randomuser.me/api/portraits/women/49.jpg"
                alt="Ms. Grace"
              />
            </div>

            <div className="card-content">

              <h3>
                Ms. Grace
                <span className="verified">✓</span>
              </h3>

              <p className="subject">
                Biology
              </p>

              <p className="followers">
                ♟ &nbsp; 7.8k Followers
              </p>

              <button className="follow-button">
                Follow
              </button>

            </div>

          </div>


          {/* Tutor 3 */}
          <div className="mentor-card">

            <div className="card-top green"></div>

            <div className="profile-image">
              <img
                src="https://randomuser.me/api/portraits/men/61.jpg"
                alt="Mr. Collins"
              />
            </div>

            <div className="card-content">

              <h3>
                Mr. Collins
              </h3>

              <p className="subject">
                Economics
              </p>

              <p className="followers">
                ♟ &nbsp; 6.4k Followers
              </p>

              <button className="follow-button">
                Follow
              </button>

            </div>

          </div>


          {/* Tutor 4 */}
          <div className="mentor-card">

            <div className="card-top blue"></div>

            <div className="profile-image">
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Mme. Claire"
              />
            </div>

            <div className="card-content">

              <h3>
                Mme. Claire
                <span className="verified">✓</span>
              </h3>

              <p className="subject">
                English Literature
              </p>

              <p className="followers">
                ♟ &nbsp; 11k Followers
              </p>

              <button className="follow-button">
                Follow
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}