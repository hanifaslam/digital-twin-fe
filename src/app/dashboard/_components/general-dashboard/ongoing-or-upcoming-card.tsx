import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { upcomingClasses } from './data'

export function OngoingOrUpcomingCard() {
  return (
    <Card className="lg:col-span-3 min-w-0">
      <CardHeader>
        <CardTitle>Upcoming Classes</CardTitle>
        <CardDescription>
          Schedules in your monitored buildings today.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
