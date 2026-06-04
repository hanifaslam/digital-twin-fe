import { socket } from '@/lib/socket'
import { BaseResponse } from '@/types/base-response'
import { ListDeviceResponse } from '@/types/response/master/device/device-response'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export const useDeviceSocket = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }

    const handleDeviceStatus = (payload: {
      device_id: string
      is_on?: boolean
      is_online?: boolean
    }) => {
      queryClient.setQueriesData<BaseResponse<ListDeviceResponse[]>>(
        { queryKey: ['device-list'], exact: false },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: oldData.data.map((device) => {
              if (device.id === payload.device_id) {
                return {
                  ...device,
                  is_on: payload.is_on ?? device.is_on ?? false,
                  is_online: payload.is_online ?? device.is_online ?? false
                }
              }
              return device
            })
          }
        }
      )
    }

    const handleSensorData = (payload: {
      room_id: string
      device_id: string
      power?: number | string | null
      voltage?: number | string | null
      current?: number | string | null
      energy?: number | string | null
      frequency?: number | string | null
      power_factor?: number | string | null
    }) => {
      queryClient.setQueriesData<BaseResponse<ListDeviceResponse[]>>(
        { queryKey: ['device-list'], exact: false },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: oldData.data.map((device) => {
              if (device.id === payload.device_id) {
                return {
                  ...device,
                  power: (payload.power as string | number) ?? device.power,
                  voltage:
                    (payload.voltage as string | number) ?? device.voltage,
                  current:
                    (payload.current as string | number) ?? device.current,
                  energy: (payload.energy as string | number) ?? device.energy,
                  frequency:
                    (payload.frequency as string | number) ?? device.frequency,
                  power_factor:
                    (payload.power_factor as string | number) ??
                    device.power_factor
                }
              }
              return device
            })
          }
        }
      )
    }

    socket.on('device-status', handleDeviceStatus)
    socket.on('sensor-data', handleSensorData)

    return () => {
      socket.off('device-status', handleDeviceStatus)
      socket.off('sensor-data', handleSensorData)
    }
  }, [queryClient])
}
