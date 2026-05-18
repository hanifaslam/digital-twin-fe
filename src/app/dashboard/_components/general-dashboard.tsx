'use client'

import { DashboardStatsSection } from './general-dashboard/dashboard-stats-section'
import { LiveOngoingClassesCard } from './general-dashboard/helper-widgets'
import { OngoingOrUpcomingCard } from './general-dashboard/ongoing-or-upcoming-card'
import { WeeklyOrMonitoringCard } from './general-dashboard/weekly-or-monitoring-card'

export function GeneralDashboard({
  roleCode,
  roleName
}: {
  roleCode?: string
  roleName?: string
}) {
  const isHelper =
    roleCode === 'HLP' || (roleName?.toLowerCase().includes('helper') ?? false)

  return (
    <div className="flex flex-col gap-6 w-full">
      <DashboardStatsSection isHelper={isHelper} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {isHelper ? (
          <>
            <LiveOngoingClassesCard />
            <OngoingOrUpcomingCard isHelper={isHelper} />
            <WeeklyOrMonitoringCard isHelper={isHelper} className="lg:col-span-7" />
          </>
        ) : (
          <>
            <WeeklyOrMonitoringCard isHelper={isHelper} />
            <OngoingOrUpcomingCard isHelper={isHelper} />
          </>
        )}
      </div>
    </div>
  )
}
