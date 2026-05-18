import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSemesterSummary } from '@/hooks/api/dashboard/use-semester-summary'
import { Activity, BookOpen, CalendarCheck, Clock } from 'lucide-react'
import { upcomingClasses } from './general-dashboard/data'

export function MyScheduleCard() {
  return (
    <Card className="min-w-0 border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle>My Teaching Schedule</CardTitle>
        <CardDescription>Your upcoming classes for today.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingClasses.map((schedule) => (
            <div
              key={`${schedule.class_name}-${schedule.time_label}`}
              className="flex items-center gap-4 rounded-lg border bg-gray-50/50 p-3 transition-colors hover:bg-gray-100/50"
            >
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-md bg-blue-100 text-blue-700">
                <span className="text-xs font-bold">
                  {schedule.time_label.split(' - ')[0]}
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold leading-none">
                  {schedule.course_name}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{schedule.class_name}</span>
                  <span className="mx-2">•</span>
                  <span>{schedule.room_name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function MyStatsCard() {
  const { data: summaryDataResponse, isLoading } = useSemesterSummary()
  const summary = summaryDataResponse?.data

  const stats = [
    {
      label: 'Classes Taught',
      value: String(summary?.classes_taught ?? 0),
      icon: BookOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      label: 'On-Time Rate',
      value: `${summary?.on_time_rate_percent ?? 0}%`,
      icon: Clock,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      label: 'Total Hours',
      value: `${summary?.total_hours ?? 0}h`,
      icon: Activity,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      label: 'Absences',
      value: String(summary?.absences ?? 0),
      icon: CalendarCheck,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ]

  return (
    <Card className="min-w-0 border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle>Semester Summary</CardTitle>
        <CardDescription>Your teaching performance statistics.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-lg border bg-gray-50/50 p-4 transition-colors hover:bg-gray-100/50"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${stat.bg} ${stat.color}`}
              >
                <stat.icon className="h-4 w-4" />
              </div>
              <div>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mb-1" />
                ) : (
                  <p className="text-2xl font-bold">{stat.value}</p>
                )}
                <p className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
