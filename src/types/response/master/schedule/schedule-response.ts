export interface ScheduleTimeSlotResponse {
  id: string
  name: string
}

export interface ListScheduleResponse {
  id: string
  study_program_name: string
  class_name: string
  room_name: string
  building_name: string
  lecturer_name: string
  course_name: string
  day: string
  status: boolean
  created_at: string
  updated_at: string
  time_label: string
}

export interface ShowScheduleResponse {
  id: string
  study_program_id: string
  study_program_name: string
  class_id: string
  class_name: string
  room_id: string
  room_name: string
  lecturer_id: string
  lecturer_name: string
  course_id: string
  course_name: string
  day: string
  time_slots: ScheduleTimeSlotResponse[]
  status: boolean
  created_at: string
  updated_at: string
}

export interface ScheduleDayResponse {
  value: string
  label: string
}
