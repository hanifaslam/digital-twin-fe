import axiosInstance, { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import {
  CreateSchedulePayload,
  UpdateSchedulePayload
} from '@/schema/master/schedule/schedule-schema'
import { BaseParams } from '@/types/global'
import {
  ListScheduleResponse,
  ScheduleDayResponse,
  ShowScheduleResponse
} from '@/types/response/master/schedule/schedule-response'

export interface ScheduleListParams extends BaseParams {
  study_program_id?: string
  class_id?: string
  status?: string
  day?: string
  room?: string
}

export interface ScheduleImportCreatedRow {
  day: string
  course_code: string
  course_name: string
  lecturer_name: string
  room_name: string
  start_time: string
  end_time: string
}

export interface ScheduleImportSkippedRow {
  row_number: number
  day: string
  course_code: string
  course_name: string
  lecturer_name: string
  room_name: string
  reason: string
}

export interface ScheduleImportResponse {
  sheet_name?: string
  study_program_name?: string
  class_name?: string
  semester?: string | number
  created_count: number
  skipped_count: number
  created: ScheduleImportCreatedRow[]
  skipped: ScheduleImportSkippedRow[]
}

export const ScheduleService = {
  list: async (params: ScheduleListParams) => {
    return api.get<ListScheduleResponse[]>(ApiEndpoint.MASTER.SCHEDULE.LIST, {
      params
    })
  },

  detail: async (id: string) => {
    return api.get<ShowScheduleResponse>(
      ApiEndpoint.MASTER.SCHEDULE.SHOW.replace(':id', id)
    )
  },

  create: async (data: CreateSchedulePayload) => {
    return api.post<null>(ApiEndpoint.MASTER.SCHEDULE.BASE, data)
  },

  update: async (id: string, data: UpdateSchedulePayload) => {
    return api.patch<null>(
      ApiEndpoint.MASTER.SCHEDULE.UPDATE.replace(':id', id),
      data
    )
  },

  delete: async (id: string) => {
    return api.delete<null>(
      ApiEndpoint.MASTER.SCHEDULE.DELETE.replace(':id', id)
    )
  },

  toggleStatus: async (id: string) => {
    return api.patch<null>(
      ApiEndpoint.MASTER.SCHEDULE.TOGGLE_STATUS.replace(':id', id)
    )
  },

  getAllDays: async () => {
    return api.get<ScheduleDayResponse[]>(
      ApiEndpoint.MASTER.SCHEDULE.GET_ALL_DAYS
    )
  },

  upload: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post<ScheduleImportResponse, FormData>(
      ApiEndpoint.MASTER.SCHEDULE.UPLOAD,
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
      ApiEndpoint.MASTER.SCHEDULE.TEMPLATE,
      {
        responseType: 'blob'
      }
    )

    return response.data
  }
}

export const {
  list: listSchedule,
  detail: showSchedule,
  create: createSchedule,
  update: updateSchedule,
  delete: deleteSchedule,
  toggleStatus: updateScheduleStatus,
  getAllDays: getAllDays,
  upload: importSchedule,
  downloadTemplate: downloadScheduleTemplate
} = ScheduleService
