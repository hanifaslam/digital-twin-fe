import { DashboardService } from '@/service/dashboard/dashboard-service'
import { useQuery } from '@tanstack/react-query'

export function useDeviceMonitoringStatus(
  buildingId?: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['device-monitoring-status', buildingId],
    queryFn: () => DashboardService.getDeviceMonitoringStatus(buildingId),
    ...options
  })
}
