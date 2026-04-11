import { socket } from '@/lib/socket'
import { LecturerStatusUpdatePayload } from '@/types/response/master/lecturer/lecturer-status'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export const useLecturerDashboardSocket = (currentLecturerId?: string) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!currentLecturerId) return

    if (!socket.connected) {
      socket.connect()
    }

    const handleStatusUpdate = (payload: LecturerStatusUpdatePayload) => {
      if (payload.id === currentLecturerId) {
        queryClient.invalidateQueries({
          queryKey: ['checkStatus', payload.id]
        })

        queryClient.invalidateQueries({
          queryKey: ['face-recog']
        })
      }
    }

    socket.on('lecturer-status-updated', handleStatusUpdate)

    return () => {
      socket.off('lecturer-status-updated', handleStatusUpdate)
      socket.disconnect()
    }
  }, [currentLecturerId, queryClient])
}
