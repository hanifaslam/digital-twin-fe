export interface ListRoleResponse {
  id: string
  code: string
  type: string
  name: string
  status: boolean
  created_at: string
  is_active: boolean
}

export interface ShowRoleResponse {
  id: string
  code: string
  name: string
  type: string
  status: boolean
  is_active: boolean
  access: ShowAccessResponse[]
}

export interface ShowAccessResponse {
  id: string
  code: string
  name: string
  is_checked?: boolean
  children?: ShowAccessResponse[]
}

export interface GetAllRoles {
  id: string
  name: string
  code: string
}
