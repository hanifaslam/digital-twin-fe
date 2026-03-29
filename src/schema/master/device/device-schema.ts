import { z } from 'zod'

const mqttRequiredMessage = 'MQTT Topic is required for this device type'
const streamRequiredMessage = 'Stream URL is required for CCTV devices'

const isCctvType = (type?: string) => type?.trim().toLowerCase() === 'cctv'

const baseDeviceSchema = z.object({
  name: z.string().trim().min(1, 'Required'),
  type: z.string().trim().min(1, 'Required'),
  room_id: z.string().trim().min(1, 'Required'),
  mqtt_topic: z.string().trim().optional(),
  stream_url: z.string().trim().optional(),
  status: z.boolean().default(true)
})

export const createDeviceSchema = baseDeviceSchema
  .refine(
    (data) => {
      if (!isCctvType(data.type)) return true
      return Boolean(data.stream_url?.trim())
    },
    {
      path: ['stream_url'],
      message: streamRequiredMessage
    }
  )
  .refine(
    (data) => {
      if (isCctvType(data.type)) return true
      return Boolean(data.mqtt_topic?.trim())
    },
    {
      path: ['mqtt_topic'],
      message: mqttRequiredMessage
    }
  )

export type CreateDevicePayload = z.infer<typeof createDeviceSchema>

export const updateDeviceSchema = baseDeviceSchema
  .partial()
  .refine(
    (data) => {
      if (!data.type || !isCctvType(data.type)) return true
      return Boolean(data.stream_url?.trim())
    },
    {
      path: ['stream_url'],
      message: streamRequiredMessage
    }
  )
  .refine(
    (data) => {
      if (!data.type || isCctvType(data.type)) return true
      return Boolean(data.mqtt_topic?.trim())
    },
    {
      path: ['mqtt_topic'],
      message: mqttRequiredMessage
    }
  )

export type UpdateDevicePayload = z.infer<typeof updateDeviceSchema>
