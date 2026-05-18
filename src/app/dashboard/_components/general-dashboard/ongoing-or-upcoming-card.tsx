import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { liveClasses, upcomingClasses } from './data'

export function OngoingOrUpcomingCard({ isHelper }: { isHelper: boolean }) {
  return (
    <Card className="lg:col-span-3 min-w-0">
      <CardHeader>
        <CardTitle>{isHelper ? 'Upcoming Classes' : 'Live Ongoing Classes'}</CardTitle>
        <CardDescription>
          {isHelper
            ? 'Schedules in your monitored buildings today.'
            : 'Real-time attendance for classes currently running.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isHelper ? (
          <div className="space-y-6">
            {upcomingClasses.map((schedule) => (
              <div
                key={`${schedule.class_name}-${schedule.time_label}`}
                className="flex flex-col gap-1 border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{schedule.course_name}</p>
                  <span className="text-xs font-medium text-muted-foreground">
                    {schedule.time_label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{schedule.class_name}</span>
                  <span>{schedule.room_name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {liveClasses.map((live) => (
              <div
                key={`${live.course}-${live.room}-${live.lecturer}`}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{live.course}</p>
                    <p className="text-xs text-muted-foreground">
                      {live.lecturer} - {live.room}
                    </p>
                  </div>
                  <div
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md ${live.statusColor}`}
                  >
                    {live.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
