import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import {
  DeviceMonitoringResponse,
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
  }
}

export const {
  getSummaryCards,
  getWeeklyAttendance,
  getDeviceMonitoringStatus,
  getSemesterSummary
} = DashboardService
