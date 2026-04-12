import { useQuery } from '@tanstack/react-query'
import {
  DeviceListParams,
  DeviceService
} from '@/service/master/device/device-service'

export function useDevice(params: Partial<DeviceListParams>) {
  return useQuery({
    queryKey: ['device-list', params],
    queryFn: () => DeviceService.list(params as DeviceListParams)
  })
}
