import { useQuery } from '@tanstack/react-query'
import {
  TimeSlotListParams,
  TimeSlotService
} from '@/service/master/time-slot/time-slot-service'

export function useTimeSlot(params: Partial<TimeSlotListParams>) {
  return useQuery({
    queryKey: ['time-slot-list', params],
    queryFn: () => TimeSlotService.list(params as TimeSlotListParams)
  })
}
