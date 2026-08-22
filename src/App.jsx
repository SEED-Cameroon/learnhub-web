import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RequireAuth, RequireTutor, GuestOnly } from './components/ProtectedRoute'
import Layout from './components/Layout'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Courses from './pages/Courses'
import Account from './pages/Account'
import Dashboard from './pages/Dashboard'
import DashboardCourses from './pages/DashboardCourses'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Public */}
            <Route path="/" element={<Home />} />

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
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="p-8 text-center text-slate-600">
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