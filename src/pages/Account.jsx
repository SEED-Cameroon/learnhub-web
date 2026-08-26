import { useAuth } from '../context/AuthContext'

export default function Account() {
  const { user } = useAuth()

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-4">
        <div>
          <p className="text-sm text-slate-500">Full Name</p>
          <p className="font-medium">{user?.name}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Role</p>
          <p className="font-medium capitalize">{user?.role}</p>
        </div>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        This page is protected — only authenticated users can see it.
      </p>
    </div>
  )
}