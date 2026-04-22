export interface GetAllBuildings {
  id: string
  name: string
}

export interface ListBuildingResponse {
  id: string
  name: string
  code: string
  longitude: string
  latitude: string
  radius: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface ShowBuildingResponse {
  id: string
  name: string
  code: string
  longitude: string
  latitude: string
  radius: string
  status: boolean
  created_at: string
  updated_at: string
}