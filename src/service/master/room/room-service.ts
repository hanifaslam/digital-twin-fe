import axiosInstance, { api } from '@/lib/api/axios'
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

export interface RoomImportCreatedRow {
  room_name: string
  building_name: string
  building_code: string
  floor_name: string
  status: string
}

export interface RoomImportSkippedRow {
  row_number: number
  building_name: string
  floor_name: string
  room_name: string
  reason: string
}

export interface RoomImportResponse {
  created_count: number
  skipped_count: number
  created: RoomImportCreatedRow[]
  skipped: RoomImportSkippedRow[]
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
  },

  upload: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post<RoomImportResponse, FormData>(
      ApiEndpoint.MASTER.ROOM.UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
  },

  downloadTemplate: async () => {
    const response = await axiosInstance.get(ApiEndpoint.MASTER.ROOM.TEMPLATE, {
      responseType: 'blob'
    })

    return response.data
  }
}

export const {
  list: listRoom,
  getAllRooms,
  detail: showRoom,
  create: createRoom,
  update: updateRoom,
  delete: deleteRoom,
  toggleStatus: updateRoomStatus,
  upload: importRoom,
  downloadTemplate: downloadRoomTemplate
} = RoomService
