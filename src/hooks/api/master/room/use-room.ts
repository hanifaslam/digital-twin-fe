import { RoomListParams, RoomService } from '@/service/master/room/room-service'
import useSWR from 'swr'

export function useRoom(params: Partial<RoomListParams>) {
  return useSWR(['room-list', params], () =>
    RoomService.list(params as RoomListParams)
  )
}
