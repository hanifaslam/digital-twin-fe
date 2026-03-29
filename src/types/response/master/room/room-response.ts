export interface ListRoomResponse {
  id: string
  name: string
  building_id: string
  building_name: string
  floor_name: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface ShowRoomResponse {
  id: string
  name: string
  building_id: string
  floor_id: string
  building_name: string
  floor_name: string
  status: boolean
  created_at: string
  updated_at: string
}
