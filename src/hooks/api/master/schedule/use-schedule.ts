import { useQuery } from '@tanstack/react-query'
import {
  ScheduleListParams,
  ScheduleService
} from '@/service/master/schedule/schedule-service'

export function useSchedule(params: Partial<ScheduleListParams>) {
  return useQuery({
    queryKey: ['schedule-list', params],
    queryFn: () => ScheduleService.list(params as ScheduleListParams)
  })
}
