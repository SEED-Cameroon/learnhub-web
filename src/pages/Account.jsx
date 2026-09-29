import { useAuth } from '@/context/AuthContext'
import MaterialIcon from '@/components/icons/MaterialIcon'
import { Card, CardContent } from '@/components/ui/card'

const FIELDS = [
  { key: 'name', label: 'Full Name', icon: 'person' },
  { key: 'email', label: 'Email', icon: 'mail' },
  { key: 'role', label: 'Role', icon: 'badge', capitalize: true },
]

export default function Account() {
  const { user } = useAuth()

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-12">
      <h1 className="text-[32px] leading-[40px] font-bold text-primary mb-2">My Account</h1>
      <p className="text-base text-on-surface-variant mb-8">
        This page is protected — only authenticated users can see it.
      </p>

      <Card className="max-w-xl border-surface-variant">
        <CardContent className="p-8 space-y-6">
          {FIELDS.map((field) => (
            <div key={field.key} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary shrink-0">
                <MaterialIcon name={field.icon} />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
                  {field.label}
                </p>
                <p className={`text-base font-medium text-on-surface ${field.capitalize ? 'capitalize' : ''}`}>
                  {user?.[field.key]}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
