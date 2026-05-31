import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CalendarClock } from 'lucide-react'
import { scheduleHariIni } from './data'

export function TodayScheduleCard({
  className = 'lg:col-span-3'
}: {
  className?: string
}) {
  return (
    <Card className={cn('min-w-0 border-gray-200 shadow-sm', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-blue-500" />
          Today Schedule
        </CardTitle>
        <CardDescription>
          Today class schedule and attendance status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scheduleHariIni.map((schedule) => (
            <div
              key={`${schedule.course_name}-${schedule.room_name}-${schedule.lecturer}`}
              className="flex items-center justify-between rounded-lg border bg-gray-50/50 p-3 transition-colors hover:bg-gray-100/50"
            >
              <div className="space-y-1 w-full">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    {schedule.course_name}
                  </p>
                  <span className="text-xs font-medium text-muted-foreground">
                    {schedule.time_label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">
                      {schedule.lecturer}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{schedule.class_name}</span>
                    <span className="mx-2">•</span>
                    <span>{schedule.building_name}</span>
                    <span className="mx-2">•</span>
                    <span>{schedule.room_name}</span>
                  </div>
                  <div
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold ${schedule.statusColor}`}
                  >
                    {schedule.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
