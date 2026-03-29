import {
  DeviceListParams,
  DeviceService
} from '@/service/master/device/device-service'
import useSWR from 'swr'

export function useDevice(params: Partial<DeviceListParams>) {
  return useSWR(['device-list', params], () =>
    DeviceService.list(params as DeviceListParams)
  )
}
