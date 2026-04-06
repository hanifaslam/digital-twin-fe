import { api } from '@/lib/api/axios'
import { ApiEndpoint } from '@/lib/api/endpoint'
import { CreateFloorPayload, UpdateFloorPayload } from '@/schema/master/floor/floor-schema'
import { BaseParams } from '@/types/global'
import { ListFloorResponse, GetAllFloors, ShowFloorResponse } from '@/types/response/master/floor/floor-response'

export type FloorListParams = BaseParams

export const FloorService = {
    list: async (params: FloorListParams) => {
        return api.get<ListFloorResponse[]>(ApiEndpoint.MASTER.FLOOR.BASE, {
          params
        })
      },
  getAllFloors: async () => {
    return api.get<GetAllFloors[]>(ApiEndpoint.MASTER.FLOOR.GET_ALL)
  },
     detail: async (id: string) => {
        return api.get<ShowFloorResponse>(
          ApiEndpoint.MASTER.FLOOR.SHOW.replace(':id', id)
        )
      },
      create: async (data: CreateFloorPayload) => {
            return api.post<null>(ApiEndpoint.MASTER.FLOOR.BASE, data)
          },
        
          update: async (id: string, data: UpdateFloorPayload) => {
            return api.patch<null>(
              ApiEndpoint.MASTER.FLOOR.UPDATE.replace(':id', id),
              data
            )
          },
        
          delete: async (id: string) => {
            return api.delete<null>(ApiEndpoint.MASTER.FLOOR.DELETE.replace(':id', id))
          },
        
          toggleStatus: async (id: string) => {
            return api.patch<null>(
              ApiEndpoint.MASTER.FLOOR.TOGGLE_STATUS.replace(':id', id)
            )
          }
}

// export const { getAllFloors: getAllFloors } = FloorService
export const {
  list: listFloor,
  getAllFloors,
  detail: showFloor,
  create: createFloor,
  update: updateFloor,
  delete: deleteFloor,
  toggleStatus: toggleFloorStatus
} = FloorService
