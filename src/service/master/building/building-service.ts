import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import { CreateBuildingPayload, UpdateBuildingPayload } from '@/schema/master/building/building-schema'
import { BaseParams } from '@/types/global'
import { GetAllBuildings, ListBuildingResponse, ShowBuildingResponse } from '@/types/response/master/building/building-response'

export interface BuildingListParams extends BaseParams {
  status?: boolean
  building_id?: string

}

export const BuildingService = {
  list: async (params: BuildingListParams) => {
      return api.get<ListBuildingResponse[]>(ApiEndpoint.MASTER.BUILDING.BASE, {
        params
      })
    },
  getAllBuildings: async () => {
    return api.get<GetAllBuildings[]>(ApiEndpoint.MASTER.BUILDING.GET_ALL)
  },
   detail: async (id: string) => {
      return api.get<ShowBuildingResponse>(
        ApiEndpoint.MASTER.BUILDING.SHOW.replace(':id', id)
      )
    },
  
    create: async (data: CreateBuildingPayload) => {
      return api.post<null>(ApiEndpoint.MASTER.BUILDING.BASE, data)
    },
  
    update: async (id: string, data: UpdateBuildingPayload) => {
      return api.patch<null>(
        ApiEndpoint.MASTER.BUILDING.UPDATE.replace(':id', id),
        data
      )
    },
  
    delete: async (id: string) => {
      return api.delete<null>(ApiEndpoint.MASTER.ROOM.DELETE.replace(':id', id))
    },
  
    toggleStatus: async (id: string) => {
      return api.patch<null>(
        ApiEndpoint.MASTER.ROOM.TOGGLE_STATUS.replace(':id', id)
      )
    }
}

export const {
  list: listBuilding,
  getAllBuildings: getAllBuildings,
  detail: showBuilding,
  create: createBuilding,
  update: updateBuilding,
  delete: deleteBuilding,
  toggleStatus: updateBuildingStatus
} = BuildingService