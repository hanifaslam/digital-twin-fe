import {
  RoleListParams,
  RoleService
} from '@/service/user-management/role-service'
import useSWR from 'swr'

export function useRole(params: Partial<RoleListParams>) {
  return useSWR(['role-list', params], () =>
    RoleService.list(params as RoleListParams)
  )
}
