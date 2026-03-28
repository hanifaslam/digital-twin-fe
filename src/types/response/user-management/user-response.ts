export interface ListUserResponse {
  id: string
  name: string
  username: string
  email: string
  role_name: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface ShowUserResponse {
  id: string
  name: string
  username: string
  email: string
  role_id: string
  role_name: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface GetAllUsersResponse {
  id: string
  name: string
}
