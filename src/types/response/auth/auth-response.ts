export interface LoginResponse {
  id: string
  username: string
  name: string
  is_superadmin: boolean
  picture?: string | null
}

export interface MeResponse {
  id: string
  email: string
  hotels: Hotels[]
  role_id: string
  role_name: string
  picture: null
  username: string
  name: string
  access: Access[]
  is_superadmin: boolean
}

export interface Access {
  id: string
  name: string
  code: string
  children?: Access[]
}

export interface VerifTokenResponse {
  valid: boolean
}

export interface Hotels {
  id: string
  name: string
  code: string
}
