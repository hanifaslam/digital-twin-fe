export interface StatusFaceResponse {
  registered: boolean
  status: string
  is_manual: boolean
  attended_at: string | null
  is_on_time: boolean
  late_minutes: number
  overridden_at: string | null
  can_verify: boolean
  can_override: boolean
  details: StatusFaceDetails
}

export interface StatusFaceDetails {
  is_weekend: boolean
  time_allowed: boolean
  is_attended: boolean
}
