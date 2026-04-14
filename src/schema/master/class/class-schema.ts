import { z } from 'zod'

export const createClassSchema = z.object({
  name: z.string().trim().min(1, 'Required'),
  study_program_id: z.string().trim().min(1, 'Required'),
  status: z.boolean().default(true)
})

export type CreateClassPayload = z.infer<typeof createClassSchema>

export const updateClassSchema = createClassSchema.partial()

export type UpdateClassPayload = z.infer<typeof updateClassSchema>
