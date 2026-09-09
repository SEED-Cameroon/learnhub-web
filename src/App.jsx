import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Tutors from "./pages/Tutors";
import TutorProfile from "./pages/TutorProfile";
import MyCourses from "./pages/MyCourses";
import Learning from "./pages/Learning";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import Subscription from "./pages/Subscription";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<Layout />}>
        <Route path="/" element={<Courses />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/tutors/:id" element={<TutorProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* TUTOR ROUTES */}
      <Route element={<ProtectedRoute allowedRole="tutor" />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/learning/:id" element={<Learning />} />
        </Route>
      </Route>

      {/* STUDENT ROUTES */}
      <Route element={<ProtectedRoute allowedRole="student" />}>
        <Route element={<Layout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/community" element={<Community />} />
          <Route path="/subscription" element={<Subscription />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;