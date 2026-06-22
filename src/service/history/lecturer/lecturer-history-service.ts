import axiosInstance, { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import { BaseParams } from '@/types/global'
import {
  LecturerActivityLogResponse,
  LecturerHistoryResponse
} from '@/types/response/history/lecturer/lecturer-history-response'

export interface LecturerHistoryListParams extends BaseParams {
  study_program?: string
  start_date?: string
  end_date?: string
}

export const LecturerHistoryService = {
  list: async (params: LecturerHistoryListParams) => {
    return api.get<LecturerHistoryResponse[]>(ApiEndpoint.HISTORY.LECTURER, {
      params
    })
  },
  activityLog: async (id: string, params?: { date?: string }) => {
    return api.get<LecturerActivityLogResponse[]>(
      ApiEndpoint.HISTORY.LECTURER_ACTIVITY_LOG.replace(':id', id),
      { params }
    )
  },
  export: async (params: LecturerHistoryListParams) => {
    const response = await axiosInstance.get(ApiEndpoint.HISTORY.LECTURER_EXPORT, {
      params,
      responseType: 'blob'
    })
    return response.data
  }
}

export const { list: listLecturerHistory, export: exportLecturerHistory } = LecturerHistoryService
