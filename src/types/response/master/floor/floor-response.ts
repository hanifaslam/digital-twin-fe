export interface GetAllFloors {
  id: string
  name: string
}

export interface ListFloorResponse {
  id: string
  name: string
  code: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface ShowFloorResponse {
  id: string
  name: string
  code : string
  status: boolean
  created_at: string
  updated_at: string
}
