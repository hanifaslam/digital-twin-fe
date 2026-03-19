import {
  UserListParams,
  UserService
} from '@/service/user-management/user-service'
import useSWR from 'swr'

export function useUser(params: Partial<UserListParams>) {
  return useSWR(['user-list', params], () =>
    UserService.list(params as UserListParams)
  )
}
