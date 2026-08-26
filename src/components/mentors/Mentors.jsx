import "./Mentors.css";
import { Link } from "react-router-dom";

function Mentors() {
  return (
    <div className="mentors-page">

      <div className="mentors-container">

        {/* Page Title */}
        <h1 className="mentors-title">
          Find Your Mentor
        </h1>

        {/* Search Bar */}
        <div className="search-box">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search by subject, name, or skill..."
          />
        </div>

        {/* Categories */}
        <div className="categories">

          <button className="category active">
            All Subjects
          </button>

          <button className="category">
            Mathematics
          </button>

          <button className="category">
            Computer Science
          </button>

          <button className="category">
            Business & Finance
          </button>

          <button className="category">
            Languages
          </button>

        </div>


        {/* Mentor Cards */}
        <div className="mentor-grid">

          {/* Card 1 */}
          <div className="mentor-card">

            <div className="card-top blue"></div>

            <div className="profile-image">
              <img
                src=""
                alt="Dr. Foning"
              />
            </div>

            <div className="card-content">

              <h3>
                Dr. Foning
                <span className="verified">✓</span>
              </h3>

              <p className="subject">
                Advanced Mathematics
              </p>

              <p className="followers">
                 &nbsp; 12k Followers
              </p>

              <button className="follow-button">
                Follow
              </button>

            </div>

          </div>


          {/* Card 2 */}
          <div className="mentor-card">

            <div className="card-top light-blue"></div>

            <div className="profile-image">
              <img
                src=""
                alt="Sarah N."
              />
            </div>

            <div className="card-content">

              <h3>
                Sarah N.
                <span className="verified">✓</span>
              </h3>

              <p className="subject">
                Full-Stack Development
              </p>

              <p className="followers">
                 &nbsp; 8.5k Followers
              </p>

              <button className="follow-button">
                Follow
              </button>

            </div>

          </div>


          {/* Card 3 */}
          <div className="mentor-card">

            <div className="card-top green"></div>

            <div className="profile-image">
              <img
                src=""
                alt="Mr. Kamga"
              />
            </div>

            <div className="card-content">

              <h3>
                Mr. Kamga
              </h3>

              <p className="subject">
                Corporate Finance
              </p>

              <p className="followers">
                 &nbsp; 5.2k Followers
              </p>

              <button className="follow-button outline">
                Follow
              </button>

            </div>

          </div>


          
          <div className="mentor-card">

            <div className="card-top blue"></div>

            <div className="profile-image">
              <img
                src=""
                alt="Mme. Bella"
              />
            </div>

            <div className="card-content">

              <h3>
                Mme. Bella
                <span className="verified">✓</span>
              </h3>

              <p className="subject">
                French Literature
              </p>

              <p className="followers">
                 &nbsp; 15k Followers
              </p>

              <button className="follow-button">
                Follow
              </button>

            </div>

          </div>

        </div>


       
        <Link to="/mentors/all" className="load-more"> 
          Load More Tutors
        </Link>

      </div>

    </div>
  );
}

export default Mentors;