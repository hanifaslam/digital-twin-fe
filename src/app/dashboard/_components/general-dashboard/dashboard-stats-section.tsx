import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardStats } from '@/hooks/api/dashboard/use-dashboard-stats'
import { Activity, Building, CalendarCheck, Users, Video, type LucideIcon } from 'lucide-react'

export type StatCardItem = {
  title: string
  value: string
  description: string
  icon: LucideIcon
  valueClassName?: string
}

function StatCard({ item, isLoading }: { item: StatCardItem; isLoading?: boolean }) {
  const Icon = item.icon

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {item.title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <>
            <div className={`text-2xl font-bold ${item.valueClassName || ''}`}>
              {item.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardStatsSection({ isHelper }: { isHelper: boolean }) {
  const { data: statsData, isLoading } = useDashboardStats()
  const stats = statsData?.data

  const items: StatCardItem[] = isHelper
    ? [
        {
          title: 'Buildings Monitored',
          value: String(stats?.buildings_monitored ?? 0),
          description: 'Buildings assigned to you',
          icon: Building
        },
        {
          title: 'Total Devices',
          value: String(stats?.total_devices ?? 0),
          description: 'Active monitoring devices',
          icon: Activity
        },
        {
          title: 'Offline Devices',
          value: String(stats?.offline_devices ?? 0),
          description: 'Needs attention',
          icon: CalendarCheck,
          valueClassName: (stats?.offline_devices ?? 0) > 0 ? 'text-red-500' : 'text-green-500'
        },
        {
          title: 'Classes Active',
          value: String(stats?.classes_active ?? 0),
          description: 'Currently running in your buildings',
          icon: Users
        }
      ]
    : [
        {
          title: 'Total Lecturers',
          value: String(stats?.total_lecturers ?? 0),
          description: `+${stats?.lecturer_new_this_month ?? 0} since last month`,
          icon: Users
        },
        {
          title: 'Total Devices',
          value: String(stats?.total_devices ?? 0),
          description: 'Active monitoring devices',
          icon: Video
        },
        {
          title: 'Active Rooms',
          value: String(stats?.active_rooms ?? 0),
          description: 'Currently in use',
          icon: Building
        },
        {
          title: 'System Health',
          value: `${stats?.system_health_percent ?? 100}%`,
          description: 'All sensors operational',
          icon: Activity
        }
      ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <StatCard key={item.title} item={item} isLoading={isLoading} />
      ))}
    </div>
  )
}
