import axiosInstance, { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import { BaseParams } from '@/types/global'
import { DeviceHistoryResponse } from '@/types/response/history/device/device-history-response'

export interface DeviceHistoryListParams extends BaseParams {
  building_id?: string
  room_id?: string
  start_date?: string
  end_date?: string
}

export const DeviceHistoryService = {
  list: async (params: DeviceHistoryListParams) => {
    return api.get<DeviceHistoryResponse[]>(ApiEndpoint.HISTORY.DEVICE, {
      params
    })
  },
  export: async (params: DeviceHistoryListParams) => {
    const response = await axiosInstance.get(ApiEndpoint.HISTORY.DEVICE_EXPORT, {
      params,
      responseType: 'blob'
    })
    return response.data
  }
}

export const { list: listDeviceHistory, export: exportDeviceHistory } = DeviceHistoryService
