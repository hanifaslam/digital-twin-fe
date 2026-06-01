import axiosInstance, { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import {
  CreateLecturerPayload,
  OverrideLecturerStatusPayload,
  UpdateLecturerPayload
} from '@/schema/master/lecturer/lecturer-schema'
import { BaseParams } from '@/types/global'
import {
  GetAllLecturerResponse,
  ListLecturerResponse,
  ShowLecturerResponse
} from '@/types/response/master/lecturer/lecturer-response'

export interface LecturerListParams extends BaseParams {
  study_program?: string
  study_program_id?: string
}

export interface LecturerImportCreatedRow {
  nip: string
  name: string
  username: string
  email: string
  study_program: string[] | string
}

export interface LecturerImportSkippedRow {
  row_number: number
  nip: string
  name: string
  reason: string
}

export interface LecturerImportResponse {
  created_count: number
  skipped_count: number
  created: LecturerImportCreatedRow[]
  skipped: LecturerImportSkippedRow[]
  default_password?: string
}

export const LecturerService = {
  list: async (params: LecturerListParams) => {
    return api.get<ListLecturerResponse[]>(ApiEndpoint.MASTER.LECTURER.BASE, {
      params
    })
  },

  getAllLecturers: async (params?: { study_program_id?: string }) => {
    return api.get<GetAllLecturerResponse[]>(
      ApiEndpoint.MASTER.LECTURER.GET_ALL,
      {
        params
      }
    )
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
  },

  overrideStatus: async (data: OverrideLecturerStatusPayload) => {
    return api.patch<null>(ApiEndpoint.MASTER.LECTURER.OVERRIDE_STATUS, data)
  },

  upload: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post<LecturerImportResponse, FormData>(
      ApiEndpoint.MASTER.LECTURER.UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
  },

  downloadTemplate: async () => {
    const response = await axiosInstance.get(
      ApiEndpoint.MASTER.LECTURER.TEMPLATE,
      {
        responseType: 'blob'
      }
    )

    return response.data
  }
}

export const {
  list: listLecturer,
  getAllLecturers,
  detail: showLecturer,
  create: createLecturer,
  update: updateLecturer,
  upload: importLecturer,
  downloadTemplate: downloadLecturerTemplate
} = LecturerService
