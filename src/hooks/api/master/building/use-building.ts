import { BuildingService } from '@/service/master/building/building-service'
import useSWR from 'swr'

export function useBuilding() {
  return useSWR('building-all', () => BuildingService.getAllBuildings())
}
