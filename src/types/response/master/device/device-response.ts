export interface ListDeviceResponse {
  id: string
  name: string
  type: string
  room_name: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface DeviceTypeResponse {
  value: string
  label?: string
}

export interface ShowDeviceResponse {
  id: string
  name: string
  type: string
  room_id: string
  room_name: string
  mqtt_topic: string
  stream_url: string
  status: boolean
  created_at: string
  updated_at: string
}
