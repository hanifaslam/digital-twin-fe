import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import {
  CreateClassPayload,
  UpdateClassPayload
} from '@/schema/master/class/class-schema'
import { BaseParams } from '@/types/global'
import {
  GetAllClassResponse,
  ListClassResponse,
  ShowClassResponse
} from '@/types/response/master/class/class-response'

export interface ClassListParams extends BaseParams {
  study_program_id?: string
  status?: string
}

export const ClassService = {
  list: async (params: ClassListParams) => {
    return api.get<ListClassResponse[]>(ApiEndpoint.MASTER.CLASS.BASE, {
      params
    })
  },

  getAllClasses: async (params?: { study_program_id?: string }) => {
    return api.get<GetAllClassResponse[]>(ApiEndpoint.MASTER.CLASS.GET_ALL, {
      params
    })
  },

  detail: async (id: string) => {
    return api.get<ShowClassResponse>(
      ApiEndpoint.MASTER.CLASS.SHOW.replace(':id', id)
    )
  },

  create: async (data: CreateClassPayload) => {
    return api.post<null>(ApiEndpoint.MASTER.CLASS.BASE, data)
  },

  update: async (id: string, data: UpdateClassPayload) => {
    return api.patch<null>(
      ApiEndpoint.MASTER.CLASS.UPDATE.replace(':id', id),
      data
    )
  },

  delete: async (id: string) => {
    return api.delete<null>(ApiEndpoint.MASTER.CLASS.DELETE.replace(':id', id))
  },

  toggleStatus: async (id: string) => {
    return api.patch<null>(
      ApiEndpoint.MASTER.CLASS.TOGGLE_STATUS.replace(':id', id)
    )
  }
}

export const {
  list: listClass,
  getAllClasses,
  detail: showClass,
  create: createClass,
  update: updateClass,
  delete: deleteClass,
  toggleStatus: updateClassStatus
} = ClassService
