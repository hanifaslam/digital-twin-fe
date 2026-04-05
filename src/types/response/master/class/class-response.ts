export interface ListClassResponse {
  id: string
  name: string
  study_program_id: string
  study_program_name: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface ShowClassResponse {
  id: string
  name: string
  study_program_id: string
  study_program_name: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface GetAllClassResponse {
  id: string
  name: string
}
