export interface ListHelperResponse {
  id: string
  name: string
  nip: string
  email: string
  phone_number: string
  user_id: string
  status: boolean
  buildings: string[]
  created_at: string
  updated_at: string
}

export interface ShowHelperResponse {
  id: string
  name: string
  nip: string
  email: string
  phone_number: string
  user_id: string
  status: boolean
  buildings: {
    id: string
    name: string
  }[]
  created_at: string
  updated_at: string
}

export interface GetAllHelperResponse {
  id: string
  name: string
}
