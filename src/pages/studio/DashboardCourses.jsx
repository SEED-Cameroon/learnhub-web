import { Link } from 'react-router-dom'
import MaterialIcon from '@/components/icons/MaterialIcon'
import { Button } from '@/components/ui/button'

export default function DashboardCourses() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-12">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[32px] leading-[40px] font-bold text-primary mb-2">Manage Courses</h1>
          <p className="text-base text-on-surface-variant">Create, edit and publish your courses.</p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline whitespace-nowrap"
        >
          <MaterialIcon name="arrow_back" className="text-base" />
          Back to Dashboard
        </Link>
      </div>

      <div className="border-2 border-dashed border-outline-variant rounded-xl p-16 flex flex-col items-center text-center bg-surface-container-low">
        <MaterialIcon name="menu_book" className="text-4xl text-outline mb-4" />
        <p className="text-on-surface-variant mb-6">You have no courses yet.</p>
        <Button className="h-auto text-sm px-6 py-2.5 rounded-full shadow-none gap-1.5">
          <MaterialIcon name="add" className="text-base" />
          Create New Course
        </Button>
      </div>
    </div>
  )
}
