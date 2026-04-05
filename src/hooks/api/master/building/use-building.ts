import { BuildingListParams, BuildingService } from '@/service/master/building/building-service'
import { RoomListParams, RoomService } from '@/service/master/room/room-service'
import useSWR from 'swr'

export function useBuilding(params: Partial<BuildingListParams>) {
  return useSWR(['building-list', params], () =>
    BuildingService.list(params as BuildingListParams)
  )
}
