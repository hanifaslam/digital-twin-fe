'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useLiveOngoingClasses } from '@/hooks/api/dashboard/use-live-ongoing-classes'
import { cn } from '@/lib/utils'
import { Building2, Users } from 'lucide-react'

const buildingOccupancy = [
  { name: 'Gedung A', used: 6, total: 8, percentage: 75, color: 'bg-blue-600' },
  { name: 'Gedung B', used: 4, total: 10, percentage: 40, color: 'bg-green-600' },
  { name: 'Gedung C', used: 9, total: 10, percentage: 90, color: 'bg-red-600' }
]

function getStatusColor(status: string) {
  switch (status) {
    case 'ONGOING':
      return 'bg-green-500/10 text-green-600'
    case 'WAITING':
      return 'bg-yellow-500/10 text-yellow-600'
    case 'LATE':
      return 'bg-red-500/10 text-red-600'
    case 'DONE':
      return 'bg-blue-500/10 text-blue-600'
    case 'CANCELLED':
      return 'bg-gray-500/10 text-gray-600'
    default:
      return 'bg-slate-500/10 text-slate-600'
  }
}

export function LiveOngoingClassesCard({
  className = 'lg:col-span-4'
}: {
  className?: string
}) {
  const { data: liveClassesResponse, isLoading } = useLiveOngoingClasses()

  const liveClasses =
    liveClassesResponse?.data.map((item) => ({
      scheduleId: item.schedule_id,
      courseName: item.course_name,
      classCode: item.class_code,
      lecturerName: item.lecturer_name,
      roomName: item.room_name,
      buildingName: item.building_name,
      startTime: item.start_time,
      endTime: item.end_time,
      status: item.status,
      statusColor: getStatusColor(item.status),
      timeLabel: `${item.start_time} - ${item.end_time}`
    })) ?? []

  return (
    <Card className={cn('min-w-0 border-gray-200 shadow-sm', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          Live Ongoing Classes
        </CardTitle>
        <CardDescription>
          Real-time attendance for classes currently running in your buildings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg border bg-gray-50/50 p-3"
              >
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
            liveClasses.map((live) => (
              <div
                key={live.scheduleId}
                className="rounded-lg border bg-gray-50/50 p-3 transition-colors hover:bg-gray-100/50"
              >
                <div className="w-full space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold">{live.courseName}</p>
                    <span className="text-xs font-medium text-muted-foreground">
                      {live.timeLabel}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700">
                        {live.lecturerName}
                      </span>
                      <span className="mx-2">&bull;</span>
                      <span>{live.classCode}</span>
                      <span className="mx-2">&bull;</span>
                      <span>{live.buildingName}</span>
                      <span className="mx-2">&bull;</span>
                      <span>{live.roomName}</span>
                    </div>
                    <div
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${live.statusColor}`}
                    >
                      {live.status.toLowerCase()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {!isLoading && liveClasses.length === 0 && (
            <div className="rounded-lg border border-dashed bg-gray-50/50 p-6 text-center text-sm text-muted-foreground">
              No live classes at the moment.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function BuildingOccupancyCard() {
  return (
    <Card className="min-w-0 border-gray-200 shadow-sm lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-purple-500" />
          Building Occupancy
        </CardTitle>
        <CardDescription>
          Real-time room usage across your assigned buildings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {buildingOccupancy.map((building) => (
            <div key={building.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-700">{building.name}</span>
                <span className="font-medium text-muted-foreground">
                  {building.used} / {building.total} Rooms
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${building.color} transition-all duration-500`}
                  style={{ width: `${building.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
