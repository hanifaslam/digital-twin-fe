import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import {
  CreateTimeSlotPayload,
  UpdateTimeSlotPayload
} from '@/schema/master/time-slot/time-slot-schema'
import { BaseParams } from '@/types/global'
import {
  GetAllTimeSlotResponse,
  ListTimeSlotResponse,
  ShowTimeSlotResponse
} from '@/types/response/master/time-slot/time-slot-response'

export type TimeSlotListParams = BaseParams

export const TimeSlotService = {
  list: async (params: TimeSlotListParams) => {
    return api.get<ListTimeSlotResponse[]>(ApiEndpoint.MASTER.TIME_SLOT.BASE, {
      params
    })
  },

  getAllTimeSlots: async () => {
    return api.get<GetAllTimeSlotResponse[]>(ApiEndpoint.MASTER.TIME_SLOT.GET_ALL)
  },

  detail: async (id: string) => {
    return api.get<ShowTimeSlotResponse>(
      ApiEndpoint.MASTER.TIME_SLOT.SHOW.replace(':id', id)
    )
  },

  create: async (data: CreateTimeSlotPayload) => {
    return api.post<null>(ApiEndpoint.MASTER.TIME_SLOT.BASE, data)
  },

  update: async (id: string, data: UpdateTimeSlotPayload) => {
    return api.patch<null>(
      ApiEndpoint.MASTER.TIME_SLOT.UPDATE.replace(':id', id),
      data
    )
  },

  delete: async (id: string) => {
    return api.delete<null>(
      ApiEndpoint.MASTER.TIME_SLOT.DELETE.replace(':id', id)
    )
  }
}

export const {
  list: listTimeSlot,
  getAllTimeSlots,
  detail: showTimeSlot,
  create: createTimeSlot,
  update: updateTimeSlot,
  delete: deleteTimeSlot
} = TimeSlotService
