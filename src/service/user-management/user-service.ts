import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import {
  ChangeUserPasswordPayload,
  CreateUserPayload,
  UpdateUserPayload
} from '@/schema/user-management/user-schema'
import { BaseParams } from '@/types/global'
import {
  GetAllUsersResponse,
  ListUserResponse,
  ShowUserResponse
} from '@/types/response/user-management/user-response'

export interface UserListParams extends BaseParams {
  status?: string
  role?: string
}

export const UserService = {
  list: async (params: UserListParams) => {
    return api.get<ListUserResponse[]>(ApiEndpoint.USER_MANAGEMENT.USER.BASE, {
      params
    })
  },

  detail: async (id: string) => {
    return api.get<ShowUserResponse>(
      ApiEndpoint.USER_MANAGEMENT.USER.SHOW.replace(':id', id)
    )
  },

  create: async (data: CreateUserPayload) => {
    return api.post<null>(ApiEndpoint.USER_MANAGEMENT.USER.BASE, data)
  },

  update: async (id: string, data: UpdateUserPayload) => {
    return api.patch<null>(
      ApiEndpoint.USER_MANAGEMENT.USER.UPDATE.replace(':id', id),
      data
    )
  },

  toggleStatus: async (id: string) => {
    return api.patch<null>(
      ApiEndpoint.USER_MANAGEMENT.USER.TOGGLE_STATUS.replace(':id', id)
    )
  },

  changePassword: async (id: string, data: ChangeUserPasswordPayload) => {
    return api.patch<null>(
      ApiEndpoint.USER_MANAGEMENT.USER.RESET_PASSWORD.replace(':id', id),
      data
    )
  },

  getAllUsers: async () => {
    return api.get<GetAllUsersResponse[]>(
      ApiEndpoint.USER_MANAGEMENT.USER.GET_ALL
    )
  }
}

export const {
  list: listUser,
  detail: showUser,
  create: createUser,
  update: updateUser,
  toggleStatus: updateUserStatus,
  changePassword: changeUserPassword
} = UserService
