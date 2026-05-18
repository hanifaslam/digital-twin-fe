import { DashboardService } from '@/service/dashboard/dashboard-service'
import { useQuery } from '@tanstack/react-query'

export function useDashboardStats(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => DashboardService.getSummaryCards(),
    ...options
  })
}
