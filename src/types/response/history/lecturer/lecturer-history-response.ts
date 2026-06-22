export interface LecturerHistoryResponse {
  id: string
  lecturer_id: string
  name: string
  study_program: string[]
  date: string
}

export interface LecturerActivityLogResponse {
  time: string
  title: string
  text: string
  description: string
}
