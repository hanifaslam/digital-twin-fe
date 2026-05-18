import {
  TableColumn,
  TableContainer
} from '@/components/common/table/table-container'
import { ScrollableTabs } from '@/components/common/tabs/scrollable-tabs'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { useDeviceMonitoringStatus } from '@/hooks/api/dashboard/use-device-monitoring-status'
import { useWeeklyAttendance } from '@/hooks/api/dashboard/use-weekly-attendance'
import { cn } from '@/lib/utils'
import useAuthStore from '@/store/auth-store'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { chartConfig } from './data'

type MonitoringDeviceRow = {
  id: string
  name: string
  building: string
  room: string
  status: 'Online' | 'Offline' | 'Warning'
}

export function WeeklyOrMonitoringCard({
  isHelper,
  className
}: {
  isHelper: boolean
  className?: string
}) {
  const { data: attendanceDataResponse, isLoading: isAttendanceLoading } =
    useWeeklyAttendance({
      enabled: !isHelper
    })

  const chartData = useMemo(() => {
    if (!attendanceDataResponse?.data) return []
    return attendanceDataResponse.data.map((item) => ({
      day: item.label,
      present: item.present,
      absent: item.absent
    }))
  }, [attendanceDataResponse])
  const { user } = useAuthStore()
  const userBuildings = useMemo(() => user?.buildings || [], [user])

  const [selectedBuilding, setSelectedBuilding] = useState('')

  const activeBuildingId = useMemo(() => {
    if (userBuildings.length === 0) return ''
    const exists = userBuildings.some((b) => b.id === selectedBuilding)
    return exists ? selectedBuilding : userBuildings[0].id
  }, [userBuildings, selectedBuilding])

  const { data: monitoringDataResponse, isLoading: isMonitoringLoading } =
    useDeviceMonitoringStatus(activeBuildingId, {
      enabled: isHelper && !!activeBuildingId
    })

  const monitoringData = monitoringDataResponse?.data

  const normalizedDevices = useMemo<MonitoringDeviceRow[]>(() => {
    const rawDevices = monitoringData?.devices || []
    return rawDevices.map((device) => {
      let status: 'Online' | 'Offline' | 'Warning' = 'Offline'
      if (device.status === 'ONLINE') status = 'Online'
      else if (device.status === 'WARNING') status = 'Warning'

      return {
        id: device.id,
        name: device.name,
        building: '',
        room: device.room_name,
        status
      }
    })
  }, [monitoringData?.devices])

  const statusSummary = useMemo(() => {
    return (
      monitoringData?.health_summary || { online: 0, warning: 0, offline: 0 }
    )
  }, [monitoringData])

  const columns: TableColumn<MonitoringDeviceRow>[] = [
    {
      key: 'name',
      label: 'Device',
      className: 'min-w-[160px]',
      render: (row) => <p className="text-sm font-medium">{row.name}</p>
    },
    {
      key: 'room',
      label: 'Room',
      className: 'min-w-[140px]',
      render: (row) => <p className="text-sm font-medium">{row.room}</p>
    },
    {
      key: 'status',
      label: 'Status',
      className: 'min-w-[130px]',
      render: (row) => {
        if (row.status === 'Online') {
          return (
            <p className="w-fit truncate rounded bg-green-100 px-2 py-1 text-sm font-medium text-green-700">
              Online
            </p>
          )
        }

        if (row.status === 'Warning') {
          return (
            <p className="w-fit truncate rounded bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-700">
              Warning
            </p>
          )
        }

        return (
          <p className="w-fit truncate rounded bg-red-100 px-2 py-1 text-sm font-medium text-red-700">
            Offline
          </p>
        )
      }
    }
  ]

  return (
    <Card className={cn('lg:col-span-4 min-w-0', className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-3">
          <div>
            <CardTitle>
              {isHelper
                ? 'Device Monitoring Status'
                : 'Weekly Attendance Overview'}
            </CardTitle>
            <CardDescription>
              {isHelper
                ? 'Overview of device connection status across buildings.'
                : 'Comparing present vs absent lecturers across the week.'}
            </CardDescription>
          </div>
          {isHelper ? (
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/device-control">View All</Link>
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {isHelper ? (
          <div className="space-y-4">
            <ScrollableTabs
              value={activeBuildingId}
              onValueChange={setSelectedBuilding}
              items={userBuildings.map((building) => ({
                id: building.id,
                label: building.name
              }))}
            />
            <TableContainer<MonitoringDeviceRow>
              data={normalizedDevices}
              columns={columns}
              loading={isMonitoringLoading}
              showNumbering={false}
              showCreatedAt={false}
              showEmptyImage={false}
              enablePagination={false}
              enableShowCount={false}
              emptyContainerMinHeight="50px"
              className="border-gray-200"
              showEmptyMessage={false}
              emptyDescription="No device data available."
              renderMobileItem={(row) => (
                <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{row.name}</p>
                    {row.status === 'Online' ? (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Online
                      </span>
                    ) : row.status === 'Warning' ? (
                      <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                        Warning
                      </span>
                    ) : (
                      <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        Offline
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="font-medium text-gray-500">Room:</span>
                    <span className="ml-1">{row.room}</span>
                  </div>
                </div>
              )}
            />
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-gray-200 bg-gray-50/40 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Health Summary:
                </p>
                <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                  Online {statusSummary.online}
                </span>
                <span className="rounded-md bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
                  Warning {statusSummary.warning}
                </span>
                <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                  Offline {statusSummary.offline}
                </span>
              </div>
            </div>
          </div>
        ) : isAttendanceLoading ? (
          <div className="flex flex-col gap-4 w-full h-[300px] justify-between py-2">
            <div className="flex gap-4 w-full h-full items-end pb-2">
              <Skeleton className="h-[40%] w-[12%] rounded-t-md mx-auto animate-pulse" />
              <Skeleton className="h-[60%] w-[12%] rounded-t-md mx-auto animate-pulse" />
              <Skeleton className="h-[80%] w-[12%] rounded-t-md mx-auto animate-pulse" />
              <Skeleton className="h-[50%] w-[12%] rounded-t-md mx-auto animate-pulse" />
              <Skeleton className="h-[70%] w-[12%] rounded-t-md mx-auto animate-pulse" />
            </div>
            <div className="flex justify-between w-full px-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="present"
                fill="var(--color-present)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="absent"
                fill="var(--color-absent)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
