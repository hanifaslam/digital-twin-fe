import {
  LecturerListParams,
  LecturerService
} from '@/service/master/lecturer/lecturer-service'
import useSWR from 'swr'

export function useLecturer(params: Partial<LecturerListParams>) {
  return useSWR(['lecturer-list', params], () =>
    LecturerService.list(params as LecturerListParams)
  )
}
