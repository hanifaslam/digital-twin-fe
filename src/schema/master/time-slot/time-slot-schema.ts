import { z } from 'zod'

function normalizeTime(value: unknown) {
  if (typeof value !== 'string') return value

  return value.trim().replace(/\./g, ':')
}

const timeField = z.preprocess(
  normalizeTime,
  z
    .string()
    .trim()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format')
)

export const createTimeSlotSchema = z.object({
  name: z.string().trim().min(1, 'Required'),
  start_time: timeField,
  end_time: timeField
})

export type CreateTimeSlotPayload = z.infer<typeof createTimeSlotSchema>

export const updateTimeSlotSchema = createTimeSlotSchema.partial()

export type UpdateTimeSlotPayload = z.infer<typeof updateTimeSlotSchema>
