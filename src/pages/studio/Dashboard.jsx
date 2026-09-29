import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import MaterialIcon from '@/components/icons/MaterialIcon'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const STATS = [
  {
    label: 'Total Students',
    value: 0,
    icon: 'group',
    iconBgClass: 'bg-primary-fixed',
    iconColorClass: 'text-primary-fixed-dim',
  },
  {
    label: 'Active Courses',
    value: 0,
    icon: 'menu_book',
    iconBgClass: 'bg-tertiary-fixed',
    iconColorClass: 'text-tertiary',
  },
  {
    label: 'Earnings (XAF)',
    value: 0,
    icon: 'payments',
    iconBgClass: 'bg-secondary-fixed',
    iconColorClass: 'text-secondary',
  },
]

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-12">
      <h1 className="text-[32px] leading-[40px] font-bold text-primary mb-2">Tutor Dashboard</h1>
      <p className="text-base text-on-surface-variant mb-8">
        Welcome back, {user?.name}. Only tutors can access this area.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {STATS.map((stat) => (
          <Card key={stat.label} className="border-surface-variant">
            <CardContent className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.iconBgClass} ${stat.iconColorClass}`}
              >
                <MaterialIcon name={stat.icon} />
              </div>
              <div>
                <p className="text-sm text-on-surface-variant">{stat.label}</p>
                <p className="text-3xl font-bold text-on-surface">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button asChild className="h-auto text-sm px-6 py-2.5 rounded-full shadow-none">
        <Link to="/dashboard/courses">Manage Courses</Link>
      </Button>
    </div>
  )
}
