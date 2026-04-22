import { z } from 'zod'

export const createLecturerSchema = z.object({
  nip: z
    .string()
    .trim()
    .min(1, 'Required')
    .regex(/^\d+$/, 'NIP must contain numbers only'),
  study_program_ids: z.array(z.string()).min(1, 'Required'),
  user_id: z.string().min(1, 'Required'),
  phone_number: z
    .string()
    .min(1, 'Required')
    .regex(/^\d+$/, 'Phone number must contain numbers only')
})

export type CreateLecturerPayload = z.infer<typeof createLecturerSchema>

export const updateLecturerSchema = createLecturerSchema.partial()

export type UpdateLecturerPayload = z.infer<typeof updateLecturerSchema>

export const overrideLecturerStatusSchema = z.object({
  status: z.enum(['BUSY', 'OFFLINE', 'AVAILABLE'])
})

export type OverrideLecturerStatusPayload = z.infer<
  typeof overrideLecturerStatusSchema
>
