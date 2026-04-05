import { z } from 'zod'

export const createScheduleSchema = z.object({
  study_program_id: z.string().trim().min(1, 'Required'),
  class_id: z.string().trim().min(1, 'Required'),
  room_id: z.string().trim().min(1, 'Required'),
  lecturer_id: z.string().trim().min(1, 'Required'),
  course_id: z.string().trim().min(1, 'Required'),
  day: z.string().trim().min(1, 'Required'),
  time_slot_id: z.array(z.string()).min(1, 'Required'),
  status: z.boolean().default(true)
})

export type CreateSchedulePayload = z.infer<typeof createScheduleSchema>

export const updateScheduleSchema = createScheduleSchema.partial()

export type UpdateSchedulePayload = z.infer<typeof updateScheduleSchema>
