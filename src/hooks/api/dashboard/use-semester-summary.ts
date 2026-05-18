import { DashboardService } from '@/service/dashboard/dashboard-service'
import { useQuery } from '@tanstack/react-query'

export function useSemesterSummary(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['semester-summary'],
    queryFn: () => DashboardService.getSemesterSummary(),
    ...options
  })
}
