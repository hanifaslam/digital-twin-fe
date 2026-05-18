import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users } from 'lucide-react'
import { liveClasses } from './data'

const buildingOccupancy = [
  { name: 'Gedung A', used: 6, total: 8, percentage: 75, color: 'bg-blue-600' },
  { name: 'Gedung B', used: 4, total: 10, percentage: 40, color: 'bg-green-600' },
  { name: 'Gedung C', used: 9, total: 10, percentage: 90, color: 'bg-red-600' }
]

export function LiveOngoingClassesCard() {
  return (
    <Card className="min-w-0 border-gray-200 shadow-sm lg:col-span-4">
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
          {liveClasses.map((live) => (
            <div
              key={`${live.course}-${live.room}-${live.lecturer}`}
              className="flex items-center justify-between rounded-lg border bg-gray-50/50 p-3 transition-colors hover:bg-gray-100/50"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold">{live.course}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="font-medium text-gray-700">{live.lecturer}</span>
                  <span className="mx-2">•</span>
                  <span>{live.room}</span>
                </div>
              </div>
              <div
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${live.statusColor}`}
              >
                {live.status}
              </div>
            </div>
          ))}
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
