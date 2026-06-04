import { useQuery } from '@tanstack/react-query'
import {
  DeviceListParams,
  DeviceService
} from '@/service/master/device/device-service'

export function useDevice(params: Partial<DeviceListParams>) {
  return useQuery({
    queryKey: ['device-list', params],
    queryFn: async () => {
      const resp = await DeviceService.list(params as DeviceListParams)

      if (resp?.data) {
        resp.data = resp.data.map((device) => ({
          ...device,
          power: device.power ?? device.latest_telemetry?.power ?? undefined,
          voltage:
            device.voltage ?? device.latest_telemetry?.voltage ?? undefined,
          current:
            device.current ?? device.latest_telemetry?.current ?? undefined,
          energy: device.energy ?? device.latest_telemetry?.energy ?? undefined,
          frequency:
            device.frequency ?? device.latest_telemetry?.frequency ?? undefined,
          power_factor:
            device.power_factor ??
            device.latest_telemetry?.power_factor ??
            undefined
        }))
      }

      return resp
    }
  })
}
