import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import {
  CreateHelperPayload,
  UpdateHelperPayload
} from '@/schema/master/helper/helper-schema'
import { BaseParams } from '@/types/global'
import {
  ListHelperResponse,
  ShowHelperResponse
} from '@/types/response/master/helper/helper-response'

export interface HelperListParams extends BaseParams {
  building_id?: string
  status?: string
}

export const HelperService = {
  list: async (params: HelperListParams) => {
    return api.get<ListHelperResponse[]>(ApiEndpoint.MASTER.HELPER.BASE, {
      params
    })
  },

  detail: async (id: string) => {
    return api.get<ShowHelperResponse>(
      ApiEndpoint.MASTER.HELPER.SHOW.replace(':id', id)
    )
  },

  create: async (data: CreateHelperPayload) => {
    return api.post<null>(ApiEndpoint.MASTER.HELPER.BASE, data)
  },

  update: async (id: string, data: UpdateHelperPayload) => {
    return api.patch<null>(
      ApiEndpoint.MASTER.HELPER.UPDATE.replace(':id', id),
      data
    )
  }
}

export const {
  list: listHelper,
  detail: showHelper,
  create: createHelper,
  update: updateHelper
} = HelperService
