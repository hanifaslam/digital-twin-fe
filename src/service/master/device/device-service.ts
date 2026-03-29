import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import {
  CreateDevicePayload,
  UpdateDevicePayload
} from '@/schema/master/device/device-schema'
import { BaseParams } from '@/types/global'
import {
  DeviceTypeResponse,
  ListDeviceResponse,
  ShowDeviceResponse
} from '@/types/response/master/device/device-response'

export interface DeviceListParams extends BaseParams {
  room_id?: string
  type?: string
}

export const DeviceService = {
  list: async (params: DeviceListParams) => {
    return api.get<ListDeviceResponse[]>(ApiEndpoint.MASTER.DEVICE.BASE, {
      params
    })
  },

  getTypes: async () => {
    return api.get<Array<string | DeviceTypeResponse>>(
      ApiEndpoint.MASTER.DEVICE.GET_TYPES
    )
  },

  detail: async (id: string) => {
    return api.get<ShowDeviceResponse>(
      ApiEndpoint.MASTER.DEVICE.SHOW.replace(':id', id)
    )
  },

  create: async (data: CreateDevicePayload) => {
    return api.post<null>(ApiEndpoint.MASTER.DEVICE.BASE, data)
  },

  update: async (id: string, data: UpdateDevicePayload) => {
    return api.patch<null>(
      ApiEndpoint.MASTER.DEVICE.UPDATE.replace(':id', id),
      data
    )
  },

  delete: async (id: string) => {
    return api.delete<null>(ApiEndpoint.MASTER.DEVICE.DELETE.replace(':id', id))
  },

  toggleStatus: async (id: string) => {
    return api.patch<null>(
      ApiEndpoint.MASTER.DEVICE.TOGGLE_STATUS.replace(':id', id)
    )
  }
}

export const {
  list: listDevice,
  getTypes,
  detail: showDevice,
  create: createDevice,
  update: updateDevice,
  delete: deleteDevice,
  toggleStatus: toggleDeviceStatus
} = DeviceService
