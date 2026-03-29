import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import {
  CreateLecturerPayload,
  UpdateLecturerPayload
} from '@/schema/master/lecturer/lecturer-schema'
import { BaseParams } from '@/types/global'
import {
  ListLecturerResponse,
  ShowLecturerResponse
} from '@/types/response/master/lecturer/lecturer-response'

export interface LecturerListParams extends BaseParams {
  study_program?: string
}

export const LecturerService = {
  list: async (params: LecturerListParams) => {
    return api.get<ListLecturerResponse[]>(ApiEndpoint.MASTER.LECTURER.BASE, {
      params
    })
  },

  detail: async (id: string) => {
    return api.get<ShowLecturerResponse>(
      ApiEndpoint.MASTER.LECTURER.SHOW.replace(':id', id)
    )
  },

  create: async (data: CreateLecturerPayload) => {
    return api.post<null>(ApiEndpoint.MASTER.LECTURER.BASE, data)
  },

  update: async (id: string, data: UpdateLecturerPayload) => {
    return api.patch<null>(
      ApiEndpoint.MASTER.LECTURER.UPDATE.replace(':id', id),
      data
    )
  }
}

export const {
  list: listLecturer,
  detail: showLecturer,
  create: createLecturer,
  update: updateLecturer
} = LecturerService
