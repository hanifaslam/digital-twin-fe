import { DashboardService } from '@/service/dashboard/dashboard-service'
import { useQuery } from '@tanstack/react-query'

export function useMyTeachingSchedule(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['my-teaching-schedule'],
    queryFn: () => DashboardService.getMyTeachingSchedule(),
    ...options
  })
}
