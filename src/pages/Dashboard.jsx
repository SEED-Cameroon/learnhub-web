import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.fullName || "Student";

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div>
            <h1 className="text-2xl font-extrabold text-blue-600">
              LearnHub
            </h1>
            <p className="text-xs text-slate-500">
              Learn. Connect. Grow.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-medium text-slate-600 sm:block">
              {displayName}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Logout
            </button>
          </div>

        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Welcome */}
        <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg">
          <p className="text-sm font-medium text-blue-100">
            STUDENT DASHBOARD
          </p>

          <h2 className="mt-2 text-3xl font-extrabold">
            Welcome, {displayName}! 👋
          </h2>

          <p className="mt-3 max-w-2xl text-blue-100">
            Continue your learning journey, discover courses, connect with
            tutors, and track your progress.
          </p>

          <button
            onClick={() => navigate("/courses")}
            className="mt-6 rounded-xl bg-white px-5 py-3 font-bold text-blue-600 shadow-sm transition hover:bg-blue-50"
          >
            Explore Courses
          </button>
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Enrolled Courses
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Completed
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Learning Hours
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              0
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Certificates
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              0
            </p>
          </div>

        </section>

        {/* Learning Area */}
        <section className="mt-10">

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                Continue Learning
              </h3>

              <p className="mt-1 text-slate-500">
                Pick up where you left off.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              📚
            </div>

            <h4 className="mt-5 text-xl font-bold text-slate-900">
              No courses yet
            </h4>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              You haven't enrolled in any courses yet. Explore LearnHub and
              find something you would like to learn.
            </p>

            <button
              onClick={() => navigate("/courses")}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              Browse Courses
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;