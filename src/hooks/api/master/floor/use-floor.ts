import {
  FloorListParams,
  FloorService
} from '@/service/master/floor/floor-service'
import useSWR from 'swr'

export function useFloor(params: Partial<FloorListParams>) {
  return useSWR(['Floor-list', params], () =>
    FloorService.list(params as FloorListParams)
  )
}
