import { z } from 'zod'

export const createBuildingSchema = z.object({
  name: z.string().trim().min(1, 'Required'),
  code: z.string().trim().min(1, 'Required'),
  status: z.boolean()
})

export type CreateBuildingPayload = z.infer<typeof createBuildingSchema>

export const updateBuildingSchema = createBuildingSchema.partial()

export type UpdateBuildingPayload = z.infer<typeof updateBuildingSchema>
