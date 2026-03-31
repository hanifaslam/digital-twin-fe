import { z } from 'zod'

export const createStudyProgramSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  status: z.boolean()
})

export type CreateStudyProgramPayload = z.infer<typeof createStudyProgramSchema>

export const updateStudyProgramSchema = createStudyProgramSchema.partial()

export type UpdateStudyProgramPayload = z.infer<typeof updateStudyProgramSchema>
