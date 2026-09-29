import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { RequireAuth, RequireTutor, GuestOnly } from '@/components/auth/ProtectedRoute'
import Layout from '@/components/layout/Layout'
import AuthLayout from '@/components/layout/AuthLayout'
import ScrollToTop from '@/components/layout/ScrollToTop'

import Home from '@/pages/Home'
import About from '@/pages/About'
import Courses from '@/pages/Courses'
import CourseDetails from '@/pages/CourseDetails'
import Tutors from '@/pages/Tutors'
import TutorProfile from '@/pages/TutorProfile'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import NotFound from '@/pages/NotFound'
import Account from '@/pages/Account'
import AccountSettings from '@/pages/AccountSettings'
import SupportTutor from '@/pages/SupportTutor'
import Subscriptions from '@/pages/Subscriptions'

// Students never load the tutor studio bundle (Frontend SRS §6).
const StudioLayout = lazy(() => import('@/components/layout/StudioLayout'))
const Dashboard = lazy(() => import('@/pages/studio/Dashboard'))
const DashboardCourses = lazy(() => import('@/pages/studio/DashboardCourses'))
const CourseEditor = lazy(() => import('@/pages/studio/CourseEditor'))
const Earnings = lazy(() => import('@/pages/studio/Earnings'))
const TutorProfileEdit = lazy(() => import('@/pages/studio/TutorProfileEdit'))

const guest = (el) => <GuestOnly>{el}</GuestOnly>
const signedIn = (el) => <RequireAuth>{el}</RequireAuth>

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<div role="status" className="p-10 text-center text-on-surface-variant">Loading…</div>}>
          <Routes>
            <Route element={<Layout />}>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              <Route path="/tutors" element={<Tutors />} />
              <Route path="/tutors/all" element={<Navigate to="/tutors" replace />} />
              <Route path="/tutors/:id" element={<TutorProfile />} />

              {/* Student account */}
              <Route path="/account" element={signedIn(<Account />)} />
              <Route path="/account/settings" element={signedIn(<AccountSettings />)} />
              <Route path="/account/subscriptions" element={signedIn(<Subscriptions />)} />
              <Route path="/tutors/:id/support" element={signedIn(<SupportTutor />)} />

              <Route path="*" element={<NotFound />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="/login" element={guest(<Login />)} />
              <Route path="/register" element={guest(<Register />)} />
              <Route path="/signup" element={<Navigate to="/register" replace />} />
            </Route>

            {/* Tutor studio */}
            <Route element={<RequireTutor><StudioLayout /></RequireTutor>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/courses" element={<DashboardCourses />} />
              <Route path="/dashboard/courses/new" element={<CourseEditor />} />
              <Route path="/dashboard/courses/:id/edit" element={<CourseEditor />} />
              <Route path="/dashboard/earnings" element={<Earnings />} />
              <Route path="/dashboard/profile" element={<TutorProfileEdit />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
