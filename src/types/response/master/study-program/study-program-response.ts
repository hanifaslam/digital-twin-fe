export interface ListStudyProgramResponse {
  id: string
  name: string
  code: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface ShowStudyProgramResponse {
  id: string
  name: string
  code: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface GetAllStudyPrograms {
  id: string
  name: string
  code: string
}
