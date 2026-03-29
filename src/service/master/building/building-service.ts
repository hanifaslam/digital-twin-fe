import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import { BaseParams } from '@/types/global'
import { GetAllBuildings } from '@/types/response/master/building/building-response'

export type BuildingListParams = BaseParams

export const BuildingService = {
  getAllBuildings: async () => {
    return api.get<GetAllBuildings[]>(ApiEndpoint.MASTER.BUILDING.GET_ALL)
  }
}

export const { getAllBuildings: getAllBuildings } = BuildingService
