import { Card, CardContent } from '@/components/ui/card'

const PLACEHOLDER_COURSES = [1, 2, 3]

export default function Courses() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-12">
      <h1 className="text-[32px] leading-[40px] font-bold text-primary mb-2">Courses</h1>
      <p className="text-base text-on-surface-variant mb-8">
        Browse and enroll in courses. This page is accessible to all authenticated users.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder cards – replace later with real data */}
        {PLACEHOLDER_COURSES.map((i) => (
          <Card key={i} className="border-surface-variant interactive-card overflow-hidden py-0 gap-0">
            <div className="h-32 bg-surface-container-low" />
            <CardContent className="p-5">
              <h3 className="font-semibold text-on-surface">Course Title {i}</h3>
              <p className="text-sm text-on-surface-variant mt-1">Tutor name</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
