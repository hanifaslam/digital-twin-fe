import { DashboardService } from '@/service/dashboard/dashboard-service'
import { useQuery } from '@tanstack/react-query'

export function useWeeklyAttendance(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['weekly-attendance'],
    queryFn: () => DashboardService.getWeeklyAttendance(),
    ...options
  })
}
