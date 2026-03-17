export interface LoginResponse {
  id: string
  name: string
  username: string
  email: string
  role_name: string
  role_id: string
}

export interface MeResponse {
  id: string
  name: string
  username: string
  email: string
  role_name: string
  role_id: string
  access: Access[]
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
