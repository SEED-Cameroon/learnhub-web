import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { RequireAuth, RequireTutor, GuestOnly } from '@/components/auth/ProtectedRoute'
import Layout from '@/components/layout/Layout'

import Home from '@/pages/Home'
import About from '@/pages/About'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Courses from '@/pages/Courses'
import Account from '@/pages/Account'
import Dashboard from '@/pages/Dashboard'
import DashboardCourses from '@/pages/DashboardCourses'
import Tutors from '@/pages/Tutors'
import AllTutors from '@/pages/AllTutors'
import CourseDetails from '@/pages/CourseDetails'
import TutorProfile from '@/pages/TutorProfile'
import SupportTutor from '@/pages/SupportTutor'
import AccountSettings from '@/pages/AccountSettings'
import Subscriptions from '@/pages/Subscriptions'
import CreateCourse from '@/pages/CreateCourse'
import EditCourse from '@/pages/EditCourse'
import Earnings from '@/pages/Earnings'
import TutorProfileEdit from '@/pages/TutorProfileEdit'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/tutors" element={<Tutors />} />
            <Route path="/tutors/all" element={<AllTutors />} />
            <Route path="/tutors/:id" element={<TutorProfile />} />

            {/* Guest only */}
            <Route
              path="/login"
              element={
                <GuestOnly>
                  <Login />
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

            {/* Authenticated (Student + Tutor) */}
            <Route
              path="/courses"
              element={
                <RequireAuth>
                  <Courses />
                </RequireAuth>
              }
            />
            <Route
              path="/account"
              element={
                <RequireAuth>
                  <Account />
                </RequireAuth>
              }
            />

            <Route
              path="/courses/:id"
              element={
                <RequireAuth>
                  <CourseDetails />
                </RequireAuth>
              }
            />
            <Route
              path="/tutors/:id/support"
              element={
                <RequireAuth>
                  <SupportTutor />
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

            {/* Tutor only */}
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

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="p-8 text-center text-on-surface-variant">
                404 – Page not found
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
