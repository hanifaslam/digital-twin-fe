export interface ListLecturerResponse {
  id: string
  name: string
  email: string
  nip: string
  study_program: string[] | string
  created_at: string
  updated_at: string
}

export interface LecturerStudyProgramResponse {
  id: string
  name: string
}

export interface ShowLecturerResponse {
  id: string
  nip: string
  study_program_ids?: string[]
  study_program_id?: string
  study_program?: LecturerStudyProgramResponse[]
  user_id: string
  name: string
  email?: string
  created_at: string
  updated_at: string
}
