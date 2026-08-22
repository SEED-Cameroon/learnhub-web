import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome to LearnHub</h1>
      <p className="text-slate-600 mb-6">
        A subscription learning platform with a YouTube-style community layer.
      </p>

      {!user && (
        <div className="flex gap-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="border border-blue-600 text-blue-600 px-5 py-2 rounded hover:bg-blue-50"
          >
            Register
          </Link>
        </div>
      )}

      {user && (
        <p className="text-green-600">
          You are logged in as <strong>{user.role}</strong>.
        </p>
      )}
    </div>
  )
}