export interface LoginResponse {
  id: string
  name: string
  username: string
  email: string
  role_name: string
  role_id: string
  role_code?: string
  nip?: string
}

export interface MeStudyProgramResponse {
  id: string
  name: string
}

export interface MeBuildingResponse {
  id: string
  name: string
}

export interface MeResponse {
  id: string
  name: string
  username: string
  email: string
  role_name: string
  role_id: string
  role_code?: string
  nip?: string
  study_programs?: MeStudyProgramResponse[]
  buildings?: MeBuildingResponse[]
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
