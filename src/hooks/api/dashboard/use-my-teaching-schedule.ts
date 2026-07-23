import { DashboardService } from '@/service/dashboard/dashboard-service'
import { useQuery } from '@tanstack/react-query'

export function useMyTeachingSchedule(
  day?: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['my-teaching-schedule', day],
    queryFn: () => DashboardService.getMyTeachingSchedule(day),
    ...options
  })
}
