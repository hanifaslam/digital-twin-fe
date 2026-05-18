export interface SummaryCardsResponse {
  total_lecturers: number
  lecturer_new_this_month: number
  active_rooms: number
  system_health_percent: number
  buildings_monitored: number
  total_devices: number
  offline_devices: number
  classes_active: number
  active_rooms_scoped: number
}

export interface WeeklyAttendanceItem {
  day: string
  label: string
  present: number
  absent: number
}

export interface DeviceMonitoringItem {
  id: string
  name: string
  room_id: string
  room_name: string
  status: 'ONLINE' | 'OFFLINE' | 'WARNING'
}

export interface DeviceMonitoringResponse {
  devices: DeviceMonitoringItem[]
  health_summary: {
    online: number
    warning: number
    offline: number
  }
}

export interface SemesterSummaryResponse {
  classes_taught: number
  on_time_rate_percent: number
  total_hours: number
  absences: number
}
