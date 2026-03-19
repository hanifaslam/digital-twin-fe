import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import { CreateRolePayload } from '@/schema/user-management/role-schema'
import { BaseParams } from '@/types/global'
import {
  GetAllRoles,
  ListRoleResponse,
  ShowAccessResponse,
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
    return api.post<null>(ApiEndpoint.USER_MANAGEMENT.ROLE.BASE, data)
  },

  update: async (id: string, data: CreateRolePayload) => {
    return api.patch(
      ApiEndpoint.USER_MANAGEMENT.ROLE.UPDATE.replace(':id', id),
      data
    )
  },
  indexAccess: async (params?: { type?: string }) => {
    return api.get<ShowAccessResponse[]>(
      ApiEndpoint.USER_MANAGEMENT.ROLE.PERMISSION,
      { params }
    )
  },
  toggleStatus: async (id: string) => {
    return api.patch(
      ApiEndpoint.USER_MANAGEMENT.ROLE.TOGGLE_STATUS.replace(':id', id)
    )
  },
  getAllRoles: async () => {
    return api.get<GetAllRoles[]>(ApiEndpoint.USER_MANAGEMENT.ROLE.GET_ALL)
  }
}

export const {
  list: listRole,
  detail: showRole,
  create: createRole,
  update: updateRole,
  indexAccess: indexAccess,
  toggleStatus: updateRoleStatus,
  getAllRoles: getAllRoles
} = RoleService
