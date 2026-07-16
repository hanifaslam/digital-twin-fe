'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyTeachingSchedule } from '@/hooks/api/dashboard/use-my-teaching-schedule'
import { cn } from '@/lib/utils'
import { CalendarClock } from 'lucide-react'
import { useState } from 'react'

function getStatusColor(status: string) {
  switch (status) {
    case 'ONGOING':
      return 'bg-green-500/10 text-green-600'
    case 'WAITING':
      return 'bg-yellow-500/10 text-yellow-600'
    case 'LATE':
      return 'bg-red-500/10 text-red-600'
    case 'DONE':
      return 'bg-primary/10 text-primary'
    case 'CANCELLED':
      return 'bg-gray-500/10 text-gray-600'
    default:
      return 'bg-slate-500/10 text-slate-600'
  }
}

export function TodayScheduleCard({
  className = 'lg:col-span-3'
}: {
  className?: string
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { data: scheduleResponse, isLoading } = useMyTeachingSchedule()

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
      statusColor: getStatusColor(item.status),
      timeLabel: `${item.start_time} - ${item.end_time}`
    })) ?? []
  const visibleScheduleItems = isExpanded
    ? scheduleItems
    : scheduleItems.slice(0, 5)
  const hasMoreThanFiveItems = scheduleItems.length > 5

  return (
    <Card className={cn('min-w-0 border-gray-200 shadow-sm', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-primary-500" />
          Today Schedule
        </CardTitle>
        <CardDescription>
          Today class schedule and attendance status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-lg border bg-gray-50/50 p-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <Skeleton className="h-4 w-72" />
                    <Skeleton className="h-7 w-20 rounded-md" />
                  </div>
                </div>
              </div>
            ))}

          {!isLoading &&
            visibleScheduleItems.map((schedule) => (
              <div
                key={schedule.scheduleId}
                className="flex items-center justify-between rounded-lg border bg-gray-50/50 p-3 transition-colors hover:bg-gray-100/50"
              >
                <div className="w-full space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      {schedule.className}
                    </p>
                    <span className="text-xs font-medium text-muted-foreground">
                      {schedule.timeLabel}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700">
                        {schedule.lecturerName}
                      </span>
                      <span className="mx-2">&bull;</span>
                      <span>{schedule.classCode}</span>
                      <span className="mx-2">&bull;</span>
                      <span>{schedule.buildingName}</span>
                      <span className="mx-2">&bull;</span>
                      <span>{schedule.roomName}</span>
                    </div>
                    <div
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${schedule.statusColor}`}
                    >
                      {schedule.status.toLowerCase()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {!isLoading && scheduleItems.length === 0 && (
            <div className="rounded-lg border border-dashed bg-gray-50/50 p-6 text-center text-sm text-muted-foreground">
              No schedule for today.
            </div>
          )}

          {!isLoading && hasMoreThanFiveItems && (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                className="min-w-28"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
