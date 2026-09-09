import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [editing, setEditing] = useState(false);

  const [fullName, setFullName] = useState(
    user?.fullName || ""
  );

  const [email, setEmail] = useState(
    user?.email || ""
  );

  const enrolledCourses = (() => {
    const saved = localStorage.getItem(
      "learnhub_enrolled_courses"
    );

    if (!saved) return [];

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  })();

  const totalCourses = enrolledCourses.length;

  const completedCourses = enrolledCourses.filter((course) => {
    const saved = localStorage.getItem(
      `learnhub_progress_${course.id}`
    );

    if (!saved) return false;

    try {
      const progress = JSON.parse(saved);

      return progress.length >= 8;
    } catch {
      return false;
    }
  }).length;

  const saveProfile = () => {
    const currentUser = {
      fullName,
      email,
    };

    localStorage.setItem(
      "learnhub_current_user",
      JSON.stringify(currentUser)
    );

    const savedDemoUser =
      localStorage.getItem("learnhub_demo_user");

    if (savedDemoUser) {
      try {
        const demoUser = JSON.parse(savedDemoUser);

        localStorage.setItem(
          "learnhub_demo_user",
          JSON.stringify({
            ...demoUser,
            fullName,
            email,
          })
        );
      } catch {
        // Ignore invalid demo user data
      }
    }

    setEditing(false);

    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= NAVBAR ================= */}

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <button
            onClick={() => navigate("/dashboard")}
            className="text-2xl font-extrabold text-blue-600"
          >
            LearnHub
          </button>

          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/my-courses")}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              My Courses
            </button>

          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* HEADER */}

        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Account
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
            My Profile
          </h1>

          <p className="mt-3 text-slate-600">
            Manage your LearnHub account and learning information.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* ================= PROFILE CARD ================= */}

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="flex flex-col items-center text-center">

              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-4xl font-extrabold text-white shadow-lg">
                {fullName
                  ? fullName.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                {fullName || "Student"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {email}
              </p>

              <div className="mt-5 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                LearnHub Student
              </div>

            </div>

          </div>

          {/* ================= ACCOUNT INFORMATION ================= */}

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your account information
                </p>
              </div>

              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )}

            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                {editing ? (
                  <input
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                ) : (
                  <div className="rounded-xl bg-slate-50 px-4 py-3 text-slate-800">
                    {fullName || "Not provided"}
                  </div>
                )}
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                {editing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                ) : (
                  <div className="rounded-xl bg-slate-50 px-4 py-3 text-slate-800">
                    {email || "Not provided"}
                  </div>
                )}
              </div>

            </div>

            {/* EDIT BUTTONS */}

            {editing && (
              <div className="mt-8 flex gap-3">

                <button
                  onClick={saveProfile}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => setEditing(false)}
                  className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

              </div>
            )}

          </div>

        </div>

        {/* ================= STATISTICS ================= */}

        <div className="mt-8">

          <h2 className="mb-5 text-2xl font-bold text-slate-900">
            Learning Statistics
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-3xl"></div>

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Enrolled Courses
              </p>

              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                {totalCourses}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-3xl"></div>

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Completed
              </p>

              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                {completedCourses}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-3xl"></div>

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Learning Hours
              </p>

              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                12
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-3xl"></div>

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Certificates
              </p>

              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                {completedCourses}
              </p>
            </div>

          </div>

        </div>

        {/* ================= CERTIFICATES ================= */}

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-50 text-3xl">

            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Certificates
              </h2>

              <p className="mt-1 text-slate-500">
                Your earned certificates will appear here.
              </p>
            </div>

          </div>

          {completedCourses === 0 ? (
            <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-center">
              <p className="font-semibold text-slate-700">
                No certificates yet
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Complete a course to earn your first certificate.
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-green-50 p-6">
              <p className="font-bold text-green-700">
                 Congratulations!
              </p>

              <p className="mt-2 text-sm text-green-600">
                You have completed {completedCourses} course
                {completedCourses > 1 ? "s" : ""}.
              </p>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default Profile;