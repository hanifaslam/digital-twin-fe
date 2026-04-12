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

    const handleDeviceStatus = () => {
      void queryClient.invalidateQueries({ queryKey: ['device-list'] })
    }

    const handleSensorData = (payload: {
      device_id: string
      power?: number
      voltage?: number
    }) => {
      queryClient.setQueriesData<BaseResponse<ListDeviceResponse[]>>(
        { queryKey: ['device-list'] },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: oldData.data.map((device) => {
              if (device.id === payload.device_id) {
                return {
                  ...device,
                  power: payload.power ?? device.power
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
      socket.disconnect()
    }
  }, [queryClient])
}
