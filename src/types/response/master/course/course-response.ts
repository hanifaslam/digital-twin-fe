export interface ListCourseResponse {
  id: string
  code: string
  name: string
  semester: number
  study_program_id: string
  study_program_name: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface ShowCourseResponse {
  id: string
  code: string
  name: string
  semester: number
  study_program_id: string
  study_program_name: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface GetAllCourseResponse {
  id: string
  code: string
  name: string
  semester: number
  study_program_id: string
}

export interface CourseSemesterResponse {
  value: number
  label: string
}
