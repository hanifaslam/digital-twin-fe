import { z } from 'zod'

export const createCourseSchema = z.object({
  code: z.string().trim().min(1, 'Required'),
  name: z.string().trim().min(1, 'Required'),
  semester: z.coerce.number().min(1, 'Required'),
  study_program_id: z.string().trim().min(1, 'Required'),
  status: z.boolean().default(true)
})

export type CreateCoursePayload = z.infer<typeof createCourseSchema>

export const updateCourseSchema = createCourseSchema.partial()

export type UpdateCoursePayload = z.infer<typeof updateCourseSchema>
