import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import { BaseParams } from '@/types/global'
import { GetAllFloors } from '@/types/response/master/floor/floor-response'

export type FloorListParams = BaseParams

export const FloorService = {
  getAllFloors: async () => {
    return api.get<GetAllFloors[]>(ApiEndpoint.MASTER.FLOOR.GET_ALL)
  }
}

export const { getAllFloors: getAllFloors } = FloorService
