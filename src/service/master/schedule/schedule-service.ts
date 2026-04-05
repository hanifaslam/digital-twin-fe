import { api } from '@/lib/api/axios'
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
  status?: string
  day?: string
  room?: string
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
  }
}

export const {
  list: listSchedule,
  detail: showSchedule,
  create: createSchedule,
  update: updateSchedule,
  delete: deleteSchedule,
  toggleStatus: updateScheduleStatus,
  getAllDays: getAllDays
} = ScheduleService
