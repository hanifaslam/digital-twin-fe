export interface ListLecturerResponse {
  id: string
  name: string
  email: string
  nip: string
  study_program_name: string
  created_at: string
  updated_at: string
}

export interface ShowLecturerResponse {
  id: string
  nip: string
  study_program_id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string
}
