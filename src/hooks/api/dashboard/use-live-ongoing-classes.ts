import { DashboardService } from '@/service/dashboard/dashboard-service'
import { useQuery } from '@tanstack/react-query'

export function useLiveOngoingClasses(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['live-ongoing-classes'],
    queryFn: () => DashboardService.getLiveOngoingClasses(),
    ...options
  })
}
