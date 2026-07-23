import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import {
  DeviceMonitoringResponse,
  LiveOngoingClassItem,
  MyTeachingScheduleItem,
  SemesterSummaryResponse,
  SummaryCardsResponse,
  WeeklyAttendanceItem
} from '@/types/response/dashboard/dashboard-response'

export const DashboardService = {
  getSummaryCards: async () => {
    return api.get<SummaryCardsResponse>(ApiEndpoint.DASHBOARD.SUMMARY_CARDS)
  },
  getWeeklyAttendance: async () => {
    return api.get<WeeklyAttendanceItem[]>(ApiEndpoint.DASHBOARD.WEEKLY_ATTENDANCE)
  },
  getDeviceMonitoringStatus: async (buildingId?: string) => {
    return api.get<DeviceMonitoringResponse>(ApiEndpoint.DASHBOARD.DEVICE_MONITORING, {
      params: buildingId ? { building_id: buildingId } : undefined
    })
  },
  getSemesterSummary: async () => {
    return api.get<SemesterSummaryResponse>(ApiEndpoint.DASHBOARD.SEMESTER_SUMMARY)
  },
  getMyTeachingSchedule: async (day?: string) => {
    let queryDay = day

    if (!queryDay || queryDay === 'TODAY') {
      const days = [
        'SUNDAY',
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY'
      ]
      queryDay = days[new Date().getDay()]
    }

    return api.get<MyTeachingScheduleItem[]>(
      ApiEndpoint.DASHBOARD.MY_TEACHING_SCHEDULE,
      { params: queryDay !== 'ALL' ? { day: queryDay } : undefined }
    )
  },
  getLiveOngoingClasses: async () => {
    return api.get<LiveOngoingClassItem[]>(
      ApiEndpoint.DASHBOARD.LIVE_ONGOING_CLASSES
    )
  }
}

export const {
  getSummaryCards,
  getWeeklyAttendance,
  getDeviceMonitoringStatus,
  getSemesterSummary,
  getMyTeachingSchedule,
  getLiveOngoingClasses
} = DashboardService
