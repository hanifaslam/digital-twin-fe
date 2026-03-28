import { z } from 'zod'

export const createLecturerSchema = z.object({
  nip: z
    .string()
    .trim()
    .min(1, 'Required')
    .regex(/^\d+$/, 'NIP must contain numbers only'),
  study_program_id: z.string().min(1, 'Required'),
  user_id: z.string().min(1, 'Required')
})

export type CreateLecturerPayload = z.infer<typeof createLecturerSchema>

export const updateLecturerSchema = createLecturerSchema.partial()

export type UpdateLecturerPayload = z.infer<typeof updateLecturerSchema>
