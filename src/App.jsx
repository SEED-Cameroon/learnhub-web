import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import {
  RequireAuth,
  RequireTutor,
  GuestOnly,
} from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import Tutors from "./pages/tutors";
import TutorProfile from "./pages/TutorProfile";
import CourseDetails from "./pages/CourseDetails";
import About from "./pages/About";
import SupportTutor from "./pages/SupportTutor";
import Account from "./pages/Account";
import AccountSettings from "./pages/AccountSettings";
import Subscriptions from "./pages/Subscriptions";
import Dashboard from "./pages/Dashboard";
import DashboardCourses from "./pages/DashboardCourses";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import Earnings from "./pages/Earnings";
import TutorProfileEdit from "./pages/TutorProfileEdit";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />

            <Route
              path="/login"
              element={
                <GuestOnly>
                  <Login />
                </GuestOnly>
              }
            />

            <Route
              path="/signup"
              element={
                <GuestOnly>
                  <Register />
                </GuestOnly>
              }
            />

            <Route
              path="/register"
              element={
                <GuestOnly>
                  <Register />
                </GuestOnly>
              }
            />

            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />

            <Route path="/tutors" element={<Tutors />} />
            <Route path="/tutors/:id" element={<TutorProfile />} />

            <Route
              path="/tutors/:id/support"
              element={
                <RequireAuth>
                  <SupportTutor />
                </RequireAuth>
              }
            />

            <Route path="/about" element={<About />} />

            <Route
              path="/account"
              element={
                <RequireAuth>
                  <Account />
                </RequireAuth>
              }
            />

            <Route
              path="/account/settings"
              element={
                <RequireAuth>
                  <AccountSettings />
                </RequireAuth>
              }
            />

            <Route
              path="/account/subscriptions"
              element={
                <RequireAuth>
                  <Subscriptions />
                </RequireAuth>
              }
            />

            <Route
              path="/dashboard"
              element={
                <RequireTutor>
                  <Dashboard />
                </RequireTutor>
              }
            />

            <Route
              path="/dashboard/courses"
              element={
                <RequireTutor>
                  <DashboardCourses />
                </RequireTutor>
              }
            />

            <Route
              path="/dashboard/courses/new"
              element={
                <RequireTutor>
                  <CreateCourse />
                </RequireTutor>
              }
            />

            <Route
              path="/dashboard/courses/:id/edit"
              element={
                <RequireTutor>
                  <EditCourse />
                </RequireTutor>
              }
            />

            <Route
              path="/dashboard/earnings"
              element={
                <RequireTutor>
                  <Earnings />
                </RequireTutor>
              }
            />

            <Route
              path="/dashboard/profile"
              element={
                <RequireTutor>
                  <TutorProfileEdit />
                </RequireTutor>
              }
            />
          </Route>

          <Route
            path="*"
            element={
              <div className="p-8 text-center text-slate-600">
                404 - Page not found
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;