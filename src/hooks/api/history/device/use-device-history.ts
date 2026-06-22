import {
  DeviceHistoryListParams,
  DeviceHistoryService
} from '@/service/history/device/device-history-service'
import useSWR from 'swr'

export function useDeviceHistory(params: Partial<DeviceHistoryListParams>) {
  return useSWR(['device-history-list', params], () =>
    DeviceHistoryService.list(params as DeviceHistoryListParams)
  )
}
