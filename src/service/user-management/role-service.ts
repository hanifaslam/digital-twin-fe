import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import { CreateRolePayload } from '@/schema/user-management/role-schema'
import { BaseParams } from '@/types/global'
import {
  ListRoleResponse,
  ShowRoleResponse
} from '@/types/response/user-management/role-response'

export interface RoleListParams extends BaseParams {
  status?: string
}

export const RoleService = {
  list: async (params: RoleListParams) => {
    return api.get<ListRoleResponse[]>(ApiEndpoint.USER_MANAGEMENT.ROLE.BASE, {
      params
    })
  },

  detail: async (id: string) => {
    return api.get<ShowRoleResponse>(
      ApiEndpoint.USER_MANAGEMENT.ROLE.SHOW.replace(':id', id)
    )
  },

  create: async (data: CreateRolePayload) => {
    return api.post(ApiEndpoint.USER_MANAGEMENT.ROLE.BASE, data)
  },

  update: async (id: string, data: CreateRolePayload) => {
    return api.put(
      ApiEndpoint.USER_MANAGEMENT.ROLE.UPDATE.replace(':id', id),
      data
    )
  },
  toggleStatus: async (id: string) => {
    return api.patch(
      ApiEndpoint.USER_MANAGEMENT.ROLE.TOGGLE_STATUS.replace(':id', id)
    )
  }
}

export const {
  list: listRole,
  detail: showRole,
  create: createRole,
  update: updateRole,
  toggleStatus: updateRoleStatus
} = RoleService
