import { Link } from 'react-router-dom'

export default function DashboardCourses() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Courses</h1>
          <p className="text-slate-600">Create, edit and publish your courses</p>
        </div>
        <Link
          to="/dashboard"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="border border-dashed border-slate-300 rounded-lg p-12 text-center">
        <p className="text-slate-500 mb-4">You have no courses yet.</p>
        <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
          + Create New Course
        </button>
      </div>
    </div>
  )
}