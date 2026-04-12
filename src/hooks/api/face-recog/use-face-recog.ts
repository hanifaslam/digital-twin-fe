import { FaceService } from '@/service/face-recog/face-recog-service'
import { useQuery } from '@tanstack/react-query'

export function useFaceRecog(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['face-recog'],
    queryFn: () => FaceService.checkStatus(),
    ...options
  })
}
