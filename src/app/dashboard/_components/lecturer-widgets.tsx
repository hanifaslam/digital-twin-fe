import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyTeachingSchedule } from '@/hooks/api/dashboard/use-my-teaching-schedule'
import { useSemesterSummary } from '@/hooks/api/dashboard/use-semester-summary'
import { useScheduleDay } from '@/hooks/api/master/schedule/use-schedule'
import { Activity, BookOpen, CalendarCheck, Clock } from 'lucide-react'
import { useState } from 'react'

export function MyScheduleCard() {
  const [selectedDay, setSelectedDay] = useState<string>('TODAY')
  const { data: scheduleResponse, isLoading } = useMyTeachingSchedule(selectedDay)
  const { data: daysResponse } = useScheduleDay()

  const scheduleItems =
    scheduleResponse?.data.map((item) => ({
      scheduleId: item.schedule_id,
      startTime: item.start_time,
      endTime: item.end_time,
      className: item.class_name,
      classCode: item.class_code,
      lecturerName: item.lecturer_name,
      roomId: item.room_id,
      roomName: item.room_name,
      buildingId: item.building_id,
      buildingName: item.building_name,
      status: item.status,
      timeLabel: `${item.start_time} - ${item.end_time}`
    })) ?? []

  return (
    <Card className="min-w-0 border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-start sm:items-center justify-between pb-2">
        <div className="space-y-1.5">
          <CardTitle>My Teaching Schedule</CardTitle>
          <CardDescription>Your upcoming classes.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODAY">Today</SelectItem>
              <SelectItem value="ALL">All Days</SelectItem>
              {daysResponse?.data?.map((day) => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-lg border bg-gray-50/50 p-3"
              >
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
            ))}

          {!isLoading &&
            scheduleItems.map((schedule) => (
              <div
                key={schedule.scheduleId}
                className="flex items-center gap-4 rounded-lg border bg-gray-50/50 p-3 transition-colors hover:bg-gray-100/50"
              >
                <div className="flex min-h-12 min-w-[112px] items-center justify-center rounded-md bg-primary/10 px-3 py-1 text-primary/70">
                  <span className="text-xs font-bold">
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold leading-none">
                    {schedule.className}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{schedule.classCode}</span>
                    <span className="mx-2">&bull;</span>
                    <span>{schedule.buildingName}</span>
                    <span className="mx-2">&bull;</span>
                    <span>{schedule.roomName}</span>
                  </div>
                </div>
              </div>
            ))}

          {!isLoading && scheduleItems.length === 0 && (
            <div className="rounded-lg border border-dashed bg-gray-50/50 p-6 text-center text-sm text-muted-foreground">
              No teaching schedule found.
            </div>
          )}
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
      color: 'text-primary/60',
      bg: 'bg-primary/10'
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
                  <Skeleton className="mb-1 h-8 w-16" />
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
