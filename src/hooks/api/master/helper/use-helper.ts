import { useQuery } from '@tanstack/react-query'
import {
  HelperListParams,
  HelperService
} from '@/service/master/helper/helper-service'

export function useHelper(params: Partial<HelperListParams>) {
  return useQuery({
    queryKey: ['helper-list', params],
    queryFn: () => HelperService.list(params as HelperListParams)
  })
}
