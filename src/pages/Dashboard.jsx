import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Tutor Dashboard</h1>
      <p className="text-slate-600 mb-8">
        Welcome back, {user?.name}. Only tutors can access this area.
      </p>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
          <p className="text-sm text-blue-600">Total Students</p>
          <p className="text-3xl font-bold text-blue-800">0</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg p-5">
          <p className="text-sm text-green-600">Active Courses</p>
          <p className="text-3xl font-bold text-green-800">0</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-5">
          <p className="text-sm text-purple-600">Earnings (XAF)</p>
          <p className="text-3xl font-bold text-purple-800">0</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          to="/dashboard/courses"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Manage Courses
        </Link>
      </div>
    </div>
  )
}