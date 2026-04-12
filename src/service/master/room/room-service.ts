import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import {
  CreateRoomPayload,
  UpdateRoomPayload
} from '@/schema/master/room/room-schema'
import { BaseParams } from '@/types/global'
import {
  GetAllRooms,
  ListRoomResponse,
  ShowRoomResponse
} from '@/types/response/master/room/room-response'

export interface RoomListParams extends BaseParams {
  building_id?: string
}

export interface RoomGetAllParams extends Partial<BaseParams> {
  building_id?: string
}

export const RoomService = {
  list: async (params: RoomListParams) => {
    return api.get<ListRoomResponse[]>(ApiEndpoint.MASTER.ROOM.BASE, {
      params
    })
  },

  getAllRooms: async (params?: RoomGetAllParams) => {
    return api.get<GetAllRooms[]>(ApiEndpoint.MASTER.ROOM.GET_ALL, {
      params
    })
  },

  detail: async (id: string) => {
    return api.get<ShowRoomResponse>(
      ApiEndpoint.MASTER.ROOM.SHOW.replace(':id', id)
    )
  },

  create: async (data: CreateRoomPayload) => {
    return api.post<null>(ApiEndpoint.MASTER.ROOM.BASE, data)
  },

  update: async (id: string, data: UpdateRoomPayload) => {
    return api.patch<null>(
      ApiEndpoint.MASTER.ROOM.UPDATE.replace(':id', id),
      data
    )
  },

  delete: async (id: string) => {
    return api.delete<null>(ApiEndpoint.MASTER.ROOM.DELETE.replace(':id', id))
  },

  toggleStatus: async (id: string) => {
    return api.patch<null>(
      ApiEndpoint.MASTER.ROOM.TOGGLE_STATUS.replace(':id', id)
    )
  }
}

export const {
  list: listRoom,
  getAllRooms,
  detail: showRoom,
  create: createRoom,
  update: updateRoom,
  delete: deleteRoom,
  toggleStatus: updateRoomStatus
} = RoomService
