import { useQuery } from '@tanstack/react-query'
import {
  ClassListParams,
  ClassService
} from '@/service/master/class/class-service'

export function useClass(params: Partial<ClassListParams>) {
  return useQuery({
    queryKey: ['class-list', params],
    queryFn: () => ClassService.list(params as ClassListParams)
  })
}
