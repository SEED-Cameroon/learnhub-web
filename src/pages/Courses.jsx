export default function Courses() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Courses</h1>
      <p className="text-slate-600 mb-6">
        Browse and enroll in courses. This page is accessible to all authenticated users.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder cards – replace later with real data */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="h-32 bg-slate-100 rounded mb-3"></div>
            <h3 className="font-semibold">Course Title {i}</h3>
            <p className="text-sm text-slate-500 mt-1">Tutor name</p>
          </div>
        ))}
      </div>
    </div>
  )
}